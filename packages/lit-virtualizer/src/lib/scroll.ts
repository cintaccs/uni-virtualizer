import { directive, NodePart, TemplateResult } from 'lit-html';
import { VirtualScroller } from './uni-virtualizer/lib/VirtualScroller.js';
import { LitMixin } from './repeat.js';

export const LitScroller = LitMixin(VirtualScroller);

const partToScroller = new WeakMap();

/**
 * Configuration options for the scroll directive.
 */
interface ScrollConfig {
  // A function that returns a lit-html TemplateResult. It will be used
  // to generate the DOM for each item in the virtual list.
  template?: (item: any, index?: number) => TemplateResult,

  layout?: any,

  // An element that receives scroll events for the virtual scroller.
  scrollTarget?: Element | Window,

  // Whether to build the virtual scroller within a shadow DOM.
  useShadowDOM?: boolean,

  // The list of items to display via the template function.
  items?: Array<any>,

  // Limit for the number of items to display. Defaults to the length
  // of the items array.
  totalItems?: number
}

/**
 * A lit-html directive that turns its parent node into a virtual scroller.
 * 
 * See ScrollConfig interface for configuration options.
 */
export const scroll = directive((config: ScrollConfig = {}) => async (part: NodePart) => {
  let scroller = partToScroller.get(part);
  if (!scroller) {
    if (!part.startNode.isConnected) {
      await Promise.resolve();
    }
    let {template, layout, scrollTarget, useShadowDOM} = config;
    scroller = new LitScroller({part, template, layout, scrollTarget, useShadowDOM});
    partToScroller.set(part, scroller);
  }
  // TODO: Can we set these in a better way?
  Object.assign(scroller, {
    items: config.items,
    totalItems: config.totalItems === undefined ? null : config.totalItems
  });
});