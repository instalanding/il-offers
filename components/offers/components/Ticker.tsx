import React from 'react';
import ScrollVelocity from '../../ui/scroll-velocity';

interface TickerComponentProps {
    value: {
        bgColor: string,
        textColor: string,
        fontSize: number,
        velocity: number,
        numCopies: number,
        texts: string[]

    }
    style?: React.CSSProperties;
}

const Ticker: React.FC<TickerComponentProps> = ({ value, style }) => {
    const props = {
        parallaxStyle: {
            background: value.bgColor,
            color: value.textColor,
        },
        scrollerStyle: { gap: '0px', fontSize: value.fontSize },
    };
    return (
        <div style={{ ...style }}>
            <div className='w-full'>
                <ScrollVelocity
                    texts={value.texts}
                    velocity={value.velocity}
                    numCopies={value.numCopies}
                    parallaxStyle={props.parallaxStyle}
                    scrollerStyle={props.scrollerStyle}
                />
            </div>
        </div>
    );
};
export default Ticker;
