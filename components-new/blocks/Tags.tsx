import React from 'react'

interface TagsComponentProps {
    value: {
        tags: [
            {
                text: string;
                color: string;
                background: string;
            }
        ]
    },
    style?: React.CSSProperties;
}

const Tags: React.FC<TagsComponentProps> = ({ value, style }) => {
    const { tags = [] } = value;

    return (
        <div className='flex flex-wrap gap-2' style={style}>
            {tags.length > 0 ? (
                tags.map((tag, index) => (
                    <span
                        key={index}
                        className='flex items-center gap-1 px-3 py-[5px] text-white text-xs font-semibold rounded-full shadow-md'
                        style={{
                            backgroundColor: tag.background,
                            color: tag.color,
                            fontFamily: 'Arial, sans-serif',
                            whiteSpace: 'nowrap',
                            display: 'inline-flex',
                        }}
                    >
                        {tag.text}
                    </span>
                ))
            ) : (
                <p className='text-gray-500 text-sm'>No tags added.</p>
            )}
        </div>
    )
}

export default Tags