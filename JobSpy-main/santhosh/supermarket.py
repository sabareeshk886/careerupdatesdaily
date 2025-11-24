from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import pandas as pd
import time

# --- SETUP SELENIUM ---
options = Options()
options.add_argument("--headless")
options.add_argument("--window-size=1920,1080")
options.add_argument("--disable-blink-features=AutomationControlled")

driver = webdriver.Chrome(options=options)
driver.get("https://www.google.com/maps/search/supermarkets+in+Tamil+Nadu/")

time.sleep(6)  # wait for map results to load

# --- SCROLL MULTIPLE TIMES TO LOAD MORE RESULTS ---
for i in range(20):
    driver.execute_script("window.scrollBy(0, 1000)")
    time.sleep(3)

# --- PARSE HTML WITH BEAUTIFULSOUP ---
soup = BeautifulSoup(driver.page_source, "html.parser")
driver.quit()

# --- FIND LISTINGS ---
places = soup.select('div[role="article"]')

data = []
for place in places:
    name = place.select_one('div[aria-level="3"]')
    name = name.get_text(strip=True) if name else None

    details = place.get_text(separator="\n", strip=True)

    address, phone, website = None, None, None
    for line in details.split("\n"):
        if "Tamil Nadu" in line or "TN" in line:
            address = line
        elif "+91" in line or line.replace(" ", "").isdigit():
            phone = line
        elif "http" in line:
            website = line

    data.append({
        "Name": name,
        "Address": address,
        "Phone": phone,
        "Website": website
    })

# --- SAVE TO EXCEL ---
df = pd.DataFrame(data)
df.drop_duplicates(subset=["Name"], inplace=True)
df.to_excel("TamilNadu_Supermarkets.xlsx", index=False)

print(f"✅ Done! Saved {len(df)} supermarkets to TamilNadu_Supermarkets.xlsx")
