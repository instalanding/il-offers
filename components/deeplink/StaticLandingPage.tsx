import React from 'react';

const StaticLandingPage = ({ redirectUrl }: { redirectUrl: string }) => {
    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <a href={redirectUrl} target='_blank' className='p-3 bg-blue-600 text-white rounded-md font-semibold'>Continue to app</a>.
        </div>
    );
};

export default StaticLandingPage;