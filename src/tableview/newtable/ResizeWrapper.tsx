import React, {FunctionComponent, useEffect, createRef} from 'react';
import { useWindowSize } from "./useWindowSize";

// Wrapper component which renders a function to dynamically resize the BaseTable (or any other child)
// based on browser window size.  May make sense to add implementation that tracks parent div size
export const ResizeWrapper: FunctionComponent = (props: any) => {
    // Custom hook tracks browser window size
    const [width, height] = useWindowSize();

    // Create ref to get dimensions directly from container element
    const container = createRef<HTMLDivElement>();

    // Log dimensions on change to test
    useEffect(() => {
        console.log(width, height);
    }, [width, height]);

    return (
        <div ref={container}>
            {props.children(width, height)}
        </div>
    )
};