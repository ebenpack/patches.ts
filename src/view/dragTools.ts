import { useCallback, useState, useEffect } from "react";
import { fromEvent, Observable, Subscription } from "rxjs";
import { flatMap, map, takeUntil, tap } from "rxjs/operators";

const getOffset = (element: Element): { top: number; left: number } => {
    var bound = element.getBoundingClientRect();
    var body = document.body;
    return {
        top: bound.top + window.pageYOffset - body.scrollTop,
        left: bound.left + window.pageXOffset - body.scrollLeft,
    };
};

export const getDragStream = (node: Element) => {
    const mouseDown = fromEvent(node as Element, "mousedown") as Observable<
        MouseEvent
    >;
    const mouseMove = fromEvent(window, "mousemove") as Observable<MouseEvent>;
    const mouseUp = fromEvent(window, "mouseup") as Observable<MouseEvent>;

    return mouseDown.pipe(
        map((downEvent: MouseEvent) => {
            const offset = getOffset(downEvent.target as HTMLElement);
            return {
                x: downEvent.clientX - offset.left,
                y: downEvent.clientY - offset.top,
            };
        }),
        flatMap((downEvent: { x: number; y: number }) => {
            return mouseMove.pipe(
                takeUntil(mouseUp),
                map((m: MouseEvent) => ({
                    x: m.clientX - downEvent.x,
                    y: m.clientY - downEvent.y,
                }))
            );
        })
    );
};

export const useDrag = ({ x, y }: { x: number; y: number }) => {
    const [dragPos, setDragPos] = useState({ x, y });
    const [
        mouseSubscription,
        setMouseSubscription,
    ] = useState<Subscription | null>(null);
    const ref = useCallback(
        (node: Element | null) => {
            if (node !== null) {
                const dragStream = getDragStream(node);
                dragStream.pipe(tap(setDragPos)).subscribe((a) => {});
                setMouseSubscription(mouseSubscription);
            }
        },
        [mouseSubscription]
    );
    useEffect(
        () => () =>
            mouseSubscription !== null
                ? mouseSubscription.unsubscribe()
                : undefined,
        [mouseSubscription]
    );
    return { ...dragPos, ref };
};
