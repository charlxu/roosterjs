import { applyFormat } from '../utils/applyFormat';
import { reuseCachedElement } from '../../domUtils/reuseCachedElement';
import type {
    ContentModelBlockHandler,
    ContentModelDivider,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleDivider: ContentModelBlockHandler<ContentModelDivider> = (
    doc: Document,
    parent: Node,
    divider: ContentModelDivider,
    context: ModelToDomContext,
    refNode: Node | null
) => {
    let element = context.allowCacheElement ? divider.cachedElement : undefined;

    if (element && !divider.isSelected) {
        refNode = reuseCachedElement(parent, element, refNode, context.rewriteFromModel);
    } else {
        element = doc.createElement(divider.tagName);

        if (context.allowCacheElement) {
            divider.cachedElement = element;
        }

        parent.insertBefore(element, refNode);
        context.rewriteFromModel.addedBlockElements.push(element);

        applyFormat(element, context.formatAppliers.divider, divider.format, context);

        if (divider.size) {
            element.setAttribute('size', divider.size);
        }
    }

    context.onNodeCreated?.(divider, element);

    return refNode;
};
