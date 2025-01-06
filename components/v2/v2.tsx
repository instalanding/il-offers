import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CarouselComponent from './components/CarouselComponent';
import AccordionComponent from './components/AccordionComponent';
import HtmlComponent from './components/HtmlComponent';
import TextComponent from './components/TextComponent';
import RatingsComponent from './components/RatingsComponent';
import MultipleCta from './components/MultipleCta';
import { config, componentsData } from './mockData';
import VariantSelector from './components/Variants/VariantsSelector';

const V2: React.FC = () => {
    return (
        <main
            className="w-full overflow-auto h-[100dvh] p-[2%] max-sm:p-0 mt-[30px]"
            style={{ height: 'calc(100vh - 80px)', overflowY: 'auto' }}
        >
            <div style={{ fontFamily: config?.fontFamily }} className="w-[400px] bg-white flex flex-col max-sm:w-full h-full shadow-lg max-sm:shadow-none max-sm:rounded-none overflow-auto mx-auto rounded-lg">
                <Header config={config} />
                {componentsData.map(component => {
                    switch (component.type) {
                        case 'carousel':
                            return <CarouselComponent key={component.id} images={component.images?.map(url => ({ url })) || []} />;
                        case 'text':
                            return (
                                <TextComponent
                                    key={component.id}
                                    value={typeof component.value === 'string' ? component.value : ''}
                                    style={component.style}
                                />
                            );
                        case 'html':
                            return (
                                <HtmlComponent
                                    key={component.id}
                                    value={typeof component.value === 'string' ? component.value : ''}
                                    style={component.style}
                                />
                            );
                        case 'ratings':
                            return (
                                <RatingsComponent
                                    key={component.id}
                                    price={component.price ?? 0}
                                    discount={component.discount ?? 0}
                                />
                            );
                        case 'accordion':
                            return <AccordionComponent key={component.id} value={component.value as { id: number; title: string; content: string; }[]} style={component.style} />;
                        case 'variants':
                            return (
                                <VariantSelector
                                    key={component.id}
                                    value={(component.variantType as 'size' | 'color' | 'quantity') ?? 'size'}
                                />
                            );
                        case 'muliple-cta':
                            return (
                                <MultipleCta
                                    key={component.id}
                                    value={component.value}
                                    style={component.style}
                                />
                            );
                        default:
                            return null;
                    }
                })}
                <Footer config={config} />
            </div>
        </main>
    );
};

export default V2;
