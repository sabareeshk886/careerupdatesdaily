const fetchScrapedJobs = async () => {
    try {
        const response = await fetch('./scraped_jobs.json');
        if (!response.ok) {
            return [];
        }
        const data = await response.json();

        return data.map((job, index) => ({
            id: `scraped-${index}`,
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.job_type || 'Full-time',
            salary: job.salary_source ? `${job.min_amount || ''} - ${job.max_amount || ''} ${job.currency || ''}` : 'Not specified',
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
