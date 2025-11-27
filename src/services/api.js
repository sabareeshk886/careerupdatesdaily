const fetchScrapedJobs = async () => {
    try {
        const response = await fetch('scraped_jobs.json');
        if (!response.ok) {
            return [];
        }
        const data = await response.json();

        const extractSalary = (job) => {
            if (job.salary_source) {
                return `${job.min_amount || ''} - ${job.max_amount || ''} ${job.currency || ''}`;
            }

            // Clean description text to remove artifacts like backslashes
            const cleanDescription = job.description ? job.description.replace(/\\/g, '') : '';

            // Try to extract from description
            const salaryPatterns = [
                /Pay:\s*(₹?[\d,.]+\s*-\s*₹?[\d,.]+)/i,
                /Salary:\s*(₹?[\d,.]+\s*-\s*₹?[\d,.]+)/i,
                /₹[\d,.]+\s*-\s*₹[\d,.]+/
            ];

            for (const pattern of salaryPatterns) {
                const match = cleanDescription.match(pattern);
                if (match) {
                    return match[1] || match[0];
                }
            }

            return 'Not specified';
        };

        return data.map((job, index) => ({
            id: job.id || `scraped-${index}`,
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.job_type || 'Full-time',
            salary: extractSalary(job),
            postedDate: job.date_posted ? new Date(job.date_posted).toLocaleDateString() : 'Recently',
            description: job.description,
            requirements: [],
            applyUrl: job.job_url,
            remote: job.is_remote || false,
            source: 'JobSpy',
            category: job.search_term // Map the search term to category
        }));
    } catch (error) {
        console.warn('Could not load scraped jobs:', error);
        return [];
    }
};

export const fetchJobs = async () => {
    return await fetchScrapedJobs();
};
