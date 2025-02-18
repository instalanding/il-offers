export const isValidDomain = (currentDomain: string, allowedDomains: string[]) => {
    // Allowing localhost and preprod/staging development domains
    if (
        currentDomain.startsWith('localhost:') ||
        currentDomain === 'preprod-il-offers.vercel.app' ||
        currentDomain === 'staging-il-offers.vercel.app'
    ) {
        return true;
    }

    // Normalize the current domain (remove protocol, www, trailing slash)
    const normalizedCurrentDomain = currentDomain
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '');

    const normalizedAllowedDomains = allowedDomains.map(domain =>
        domain.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
    );
    
    return normalizedAllowedDomains.includes(normalizedCurrentDomain);
};