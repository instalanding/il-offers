import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const AccordionComponent: React.FC<{ value: { id: number; title: string; content: string; }[]; style?: React.CSSProperties }> = ({ value, style }) => {
    return (
        <Accordion style={style} type="single" collapsible className="w-full">
            {value.map((item) => (
                <AccordionItem key={item.id} value={item.id.toString()}>
                    <AccordionTrigger>{item.title}</AccordionTrigger>
                    <AccordionContent>
                        {item.content}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

export default AccordionComponent; 