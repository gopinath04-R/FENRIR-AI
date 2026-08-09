from io import BytesIO
from typing import Any

import pandas as pd
from fastapi import APIRouter, File, HTTPException, UploadFile

router = APIRouter()


def find_column(columns: list[str], possible_names: list[str]) -> str | None:
    normalized = {column.lower().strip(): column for column in columns}

    for name in possible_names:
        if name.lower() in normalized:
            return normalized[name.lower()]

    return None


@router.get("/")
def status() -> dict[str, str]:
    return {
        "module": "SEO Intelligence",
        "status": "online",
    }


@router.post("/analyze")
async def analyze_seo(
    file: UploadFile = File(...)
) -> dict[str, Any]:
    filename = file.filename or ""

    if not filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a CSV file.",
        )

    content = await file.read()

    try:
        dataframe = pd.read_csv(BytesIO(content))
    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=f"Unable to read CSV: {error}",
        ) from error

    if dataframe.empty:
        raise HTTPException(
            status_code=400,
            detail="Uploaded CSV is empty.",
        )

    columns = dataframe.columns.tolist()

    impressions_column = find_column(
        columns,
        ["impressions", "impression"],
    )

    clicks_column = find_column(
        columns,
        ["clicks", "click"],
    )

    ctr_column = find_column(
        columns,
        ["ctr", "click through rate"],
    )

    position_column = find_column(
        columns,
        ["position", "average position"],
    )

    page_column = find_column(
        columns,
        ["page", "landing page", "url"],
    )

    query_column = find_column(
        columns,
        ["query", "search query", "keyword"],
    )

    total_impressions = (
        float(dataframe[impressions_column].fillna(0).sum())
        if impressions_column
        else 0
    )

    total_clicks = (
        float(dataframe[clicks_column].fillna(0).sum())
        if clicks_column
        else 0
    )

    average_ctr = 0.0

    if total_impressions > 0 and total_clicks >= 0:
        average_ctr = (total_clicks / total_impressions) * 100
    elif ctr_column:
        ctr_values = (
            dataframe[ctr_column]
            .astype(str)
            .str.replace("%", "", regex=False)
        )

        average_ctr = pd.to_numeric(
            ctr_values,
            errors="coerce",
        ).fillna(0).mean()

    average_position = (
        float(
            pd.to_numeric(
                dataframe[position_column],
                errors="coerce",
            ).fillna(0).mean()
        )
        if position_column
        else 0
    )

    opportunities: list[dict[str, Any]] = []

    if impressions_column:
        working_dataframe = dataframe.copy()

        working_dataframe["_impressions"] = pd.to_numeric(
            working_dataframe[impressions_column],
            errors="coerce",
        ).fillna(0)

        if clicks_column:
            working_dataframe["_clicks"] = pd.to_numeric(
                working_dataframe[clicks_column],
                errors="coerce",
            ).fillna(0)

            working_dataframe["_ctr"] = (
                working_dataframe["_clicks"]
                / working_dataframe["_impressions"].replace(0, pd.NA)
                * 100
            ).fillna(0)

        elif ctr_column:
            working_dataframe["_ctr"] = pd.to_numeric(
                working_dataframe[ctr_column]
                .astype(str)
                .str.replace("%", "", regex=False),
                errors="coerce",
            ).fillna(0)

        else:
            working_dataframe["_ctr"] = 0

        if position_column:
            working_dataframe["_position"] = pd.to_numeric(
                working_dataframe[position_column],
                errors="coerce",
            ).fillna(0)
        else:
            working_dataframe["_position"] = 0

        median_impressions = working_dataframe["_impressions"].median()

        opportunity_rows = working_dataframe[
            (working_dataframe["_impressions"] >= median_impressions)
            & (working_dataframe["_ctr"] < max(average_ctr, 2))
        ].sort_values(
            by="_impressions",
            ascending=False,
        ).head(10)

        for _, row in opportunity_rows.iterrows():
            identifier = "Unknown"

            if page_column:
                identifier = str(row.get(page_column, "Unknown"))
            elif query_column:
                identifier = str(row.get(query_column, "Unknown"))

            impressions = float(row["_impressions"])
            ctr = float(row["_ctr"])
            position = float(row["_position"])

            score = min(
                100,
                round(
                    (impressions / max(total_impressions, 1)) * 5000
                    + max(0, 10 - ctr) * 5
                    + max(0, 15 - position),
                    1,
                ),
            )

            opportunities.append(
                {
                    "page": identifier,
                    "problem": "High impressions with low CTR",
                    "intent": "Needs classification",
                    "impressions": round(impressions),
                    "ctr": round(ctr, 2),
                    "position": round(position, 2),
                    "score": score,
                    "priority": (
                        "Critical"
                        if score >= 85
                        else "High"
                        if score >= 70
                        else "Medium"
                    ),
                    "action": (
                        "Improve title and meta description, "
                        "then check whether page content matches search intent."
                    ),
                }
            )

    return {
        "filename": filename,
        "rows": int(len(dataframe)),
        "columns": columns,
        "summary": {
            "total_impressions": round(total_impressions),
            "total_clicks": round(total_clicks),
            "average_ctr": round(average_ctr, 2),
            "average_position": round(average_position, 2),
            "opportunity_count": len(opportunities),
        },
        "opportunities": opportunities,
    }