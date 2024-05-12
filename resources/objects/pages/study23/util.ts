import { ElementDescriptor } from "resources/objects/pages/study23/types";

type ElementEvent = (data: ElementDescriptor, elem: HTMLElement) => void;
interface ElementOptions {
    label?: string;
    onSelect?: ElementEvent,
    onDeselect?: ElementEvent,
    onEnter?: ElementEvent,
    onLeave?: ElementEvent
}

function addSelectEvents(elem: HTMLElement, data: ElementDescriptor, opts?: ElementOptions) {
    elem.addEventListener('click', e => {
        e?.preventDefault?.();
        elem.classList.toggle("selected");
        if(elem.classList.contains("selected"))
            opts?.onSelect?.(data, elem);
        else
            opts?.onDeselect?.(data, elem);
    });

    elem.addEventListener('mouseenter', e => {
        e?.preventDefault?.();
        opts?.onEnter?.(data, elem);
    });

    elem.addEventListener('mouseleave', e => {
        e?.preventDefault?.();
        opts?.onLeave?.(data, elem);
    });
}

export function placeElement(data: ElementDescriptor, parent: HTMLElement, target: HTMLElement, opts?: ElementOptions) {
    const e = document.createElement("div");
    e.classList.add("elem");

    const tr = target.getBoundingClientRect();

    // Position element relative to target
    e.style.top = String(tr.y + tr.height * data.y) + "px";
    e.style.left = String(tr.x + tr.width * data.x) + "px";
    e.style.width = String(tr.width * (data.width ?? 10) / 100) + "px";
    e.style.height = String(tr.height * (data.height ?? 10) / 100) + "px";

    // Add label
    if(opts?.label != undefined) {
        const l = document.createElement('i');
        l.innerText = opts.label;
        e.appendChild(l);
    }

    // Add data attributes
    const attrs = Object.keys(data.data ?? {});
    attrs.forEach(attr => {
        e.setAttribute(`data-${attr}`, data.data?.[attr] ?? "");
    });

    addSelectEvents(e, data, opts);

    parent.appendChild(e);
}
window.placeElement = placeElement;

declare global {
    interface Window {
        placeElement: typeof placeElement;
    }
}