import csv
from jobspy import scrape_jobs

jobs = scrape_jobs(
    site_name=["indeed", "linkedin", "google", "glassdoor"],  # Removed bayt, naukri, bdjobs, zip_recruiter
    search_term="= ",
    google_search_term="jobs in India since yesterday",  # Better Google Jobs query
    location="India",
    results_wanted=50,          # Fetch more results
    hours_old=72,               # Last 3 days
    country_indeed="India",     # Correct for India
    linkedin_fetch_description=True  # More job info (slower but richer)
)

print(f"Found {len(jobs)} jobs")
print(jobs.head())

# Save to CSV
jobs.to_csv(
    "fulljobs.csv",
    quoting=csv.QUOTE_NONNUMERIC,
    escapechar="\\",
    index=False
)
