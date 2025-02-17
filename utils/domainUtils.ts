export const isValidDomain = (currentDomain: string, allowedDomains: string[]) => {
    // Allowing localhost and development domains
    if (
        currentDomain === 'localhost' ||
        currentDomain.startsWith('localhost:') ||
        currentDomain.endsWith('.local') ||
        currentDomain.endsWith('.test') ||
        currentDomain.endsWith('.development')
    ) {
        return true;
    }

    // Normalize the current domain (remove protocol, www, trailing slash)
    let normalizedCurrentDomain = currentDomain
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, ''); // Remove trailing slash

    // Normalize allowed domains
    const normalizedAllowedDomains = allowedDomains.map(domain =>
        domain.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
    );

    return normalizedAllowedDomains.some(domain => {
        // Direct match
        if (normalizedCurrentDomain === domain) return true;

        // Check wildcard subdomain match (e.g., "*.example.com")
        if (domain.startsWith('*.')) {
            const baseDomain = domain.slice(2); // Remove "*."
            return normalizedCurrentDomain.endsWith(`.${baseDomain}`);
        }

        // Check standard subdomain match (e.g., "sub.example.com" allowed under "example.com")
        return normalizedCurrentDomain.endsWith(`.${domain}`);
    });
};