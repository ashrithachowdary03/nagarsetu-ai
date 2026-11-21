import asyncio
from ai_service import analyse_civic_complaint

async def test():
    test_cases = [
        ("drainage leakage near my home", "it started yesterday and dirty sewage water is overflowing", "Lane 4, Sector 7"),
        ("Deep pothole causing accidents", "huge crater on the road two wheelers are slipping", "Ring Road Junction"),
        ("Street light not working for 3 days", "very dark at night unsafe for women and pedestrians", "Gandhi Nagar"),
        ("Garbage dump piling up near school", "foul smell and stray dogs gathering around garbage heap", "Near St. Xavier School"),
        ("Pipeline burst drinking water wasting", "clean water gushing from broken pipe under pavement", "Main Market Road"),
        ("Broken footpath slab", "concrete slab broken on pedestrian walkway", "Central Avenue")
    ]
    
    for title, desc, loc in test_cases:
        res = await analyse_civic_complaint(title, desc, loc)
        print(f"INPUT: '{title}'")
        print(f" -> Category:    {res.category}")
        print(f" -> Department:  {res.suggested_department}")
        print(f" -> Priority:    {res.priority}")
        print(f" -> Reason:      {res.priority_reason}")
        print(f" -> Summary:     {res.summary}\n")

if __name__ == "__main__":
    asyncio.run(test())
