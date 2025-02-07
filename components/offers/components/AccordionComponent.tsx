import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const AccordionComponent: React.FC<{ value: { id: number; title: string; content: string; }[]; style?: React.CSSProperties }> = ({ value, style }) => {
    return (
        <Accordion style={style} type="single" collapsible className="w-full border-t border-gray-200">
            {value.map((item) => (
                <AccordionItem key={item.id} value={item.id.toString()} className="border-b rounded-none border-gray-200">
                    <AccordionTrigger className="text-left py-4 px-2 text-sm font-semibold text-gray-800 hover:text-gray-600 transition-all">{item.title}</AccordionTrigger>
                    <AccordionContent className="py-2 px-4 text-sm text-gray-600">
                        {item.content}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

export default AccordionComponent; 