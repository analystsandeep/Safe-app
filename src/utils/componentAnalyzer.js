export function analyzeComponents(manifestContent) {
    const result = {
        exportedActivities: [],
        exportedServices: [],
        exportedReceivers: [],
        exportedProviders: [],
        totalExported: 0,
        unprotectedCount: 0,
        components: []
    };

    const componentTypes = [
        { tag: 'activity', list: 'exportedActivities' },
        { tag: 'service', list: 'exportedServices' },
        { tag: 'receiver', list: 'exportedReceivers' },
        { tag: 'provider', list: 'exportedProviders' },
    ];

    componentTypes.forEach(({ tag, list }) => {
        // Match the full component block: <tag ...> ... </tag>  OR  <tag ... />
        const openPattern = new RegExp(`<${tag}[\\s>]`, 'gi');
        const closePattern = new RegExp(`</${tag}>`, 'i');
        let startIdx;

        // Reset
        openPattern.lastIndex = 0;
        let match;
        while ((match = openPattern.exec(manifestContent)) !== null) {
            startIdx = match.index;
            // Find the end of this component block
            let endIdx;
            const selfClose = manifestContent.indexOf('/>', startIdx);
            const closeTag = manifestContent.search(new RegExp(`</${tag}>`, 'i'));

            // Look for the NEXT close tag after this open tag
            const afterOpen = manifestContent.indexOf('>', startIdx);
            const closeTagIdx = (() => {
                const re = new RegExp(`</${tag}>`, 'gi');
                re.lastIndex = startIdx;
                const m = re.exec(manifestContent);
                return m ? m.index + m[0].length : -1;
            })();
            const selfCloseIdx = (() => {
                // self-closing: the /> appears before the next child open tag of same type
                const re = /\/>/g;
                re.lastIndex = startIdx;
                const m = re.exec(manifestContent);
                return m ? m.index + 2 : Infinity;
            })();

            if (closeTagIdx !== -1 && closeTagIdx < selfCloseIdx) {
                endIdx = closeTagIdx;
            } else {
                endIdx = Math.min(selfCloseIdx, manifestContent.length);
            }

            const block = manifestContent.slice(startIdx, endIdx);

            const exportedMatch = block.match(/android:exported\s*=\s*"(true|false)"/i);
            const isExported = exportedMatch ? exportedMatch[1].toLowerCase() === 'true' : false;
            const hasIntentFilter = /<intent-filter/i.test(block);
            const effectivelyExported = isExported || (hasIntentFilter && !exportedMatch);

            const nameMatch = block.match(/android:name\s*=\s*"([^"]+)"/i);
            const componentName = nameMatch ? nameMatch[1] : 'Unknown';

            const hasPermission = /android:permission\s*=\s*"[^"]+"/i.test(block);

            if (effectivelyExported) {
                result[list].push(componentName);
                result.totalExported++;
                if (!hasPermission) result.unprotectedCount++;
            }

            result.components.push({
                type: tag,
                name: componentName,
                isExported: effectivelyExported,
                hasPermission
            });

            // Advance past this block to avoid re-matching inner nested tags
            openPattern.lastIndex = endIdx;
        }
    });

    // Fallback for binary/encoded content where XML parsing yielded nothing
    if (result.components.length === 0) {
        const simplePattern = /android:exported\s*=\s*"true"/gi;
        let count = 0;
        while (simplePattern.exec(manifestContent) !== null) count++;
        result.totalExported = count;
        result.unprotectedCount = count;
    }

    return result;
}
