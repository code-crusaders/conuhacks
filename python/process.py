import sys
import datetime

import numpy as np
import pandas as pd

import json
import aiohttp
import asyncio

# Check if the second argument is a JSON string

newEntry = sys.argv[1]
# Final String to output
finalString = ""
# Print out a json object so combine all string together

"""
Import data
"""
array = [json.loads(newEntry)]

with open("data.txt", "r") as f:
    Lines = f.readlines()
    # Parse each line as JSON
    for line in Lines:
        array.append(json.loads(line))

data = pd.DataFrame(array)

# Remove duplicate data (Slack API making 2 calls for some reason so dealing with this here)

data.drop_duplicates(
    subset=["username", "text", "timestamp"], keep="last", inplace=True
)

# Generate size of text column
data["messageSize"] = data["text"].apply(lambda text: len(text))
# Filter for messages of certain size
data = data[data["messageSize"] > 5]

# Timestamp conversion
data["timestamp"] = data["timestamp"].apply(
    lambda ts: datetime.datetime.fromtimestamp(float(ts))
)

########## Add filtering by channel name (latest message channel only)
data = data[data["channel"] == data["channel"].iloc[-1]]

"""
Convert a list of strings into a summarized form using metaTextAI pre trained models through their API
"""

async def textSummary(textsToSummarize):
    try:
        fetch_requests = []
        for i in range(len(textsToSummarize)):
            async with aiohttp.ClientSession() as session:
                response = await session.post(
                    "https://api.metatext.ai/hub-inference/TzP7CJHnWlaxcrDLHOQE",
                    headers={
                        "content-type": "application/json",
                        "x-api-key": "Z0CDIgI42M5hggX0bpBB61UZswN4NiHNaqqsFIWd",
                    },
                    json={"text": textsToSummarize[i]},
                )
                json_response = await response.json()
                fetch_requests.append(json_response)
        return fetch_requests
    except Exception as e:
        pass

"""
Extract main keywords from a string by using metaTextAI pre trained models through their API
"""

async def extractKeywords(message):
    try:
        fetch_requests = []
        for i in range(len(message)):
            async with aiohttp.ClientSession() as session:
                response = await session.post(
                    "https://api.metatext.ai/hub-inference/LMaBDYfAAa049ufLPcrc",
                    headers={
                        "content-type": "application/json",
                        "x-api-key": "Z0CDIgI42M5hggX0bpBB61UZswN4NiHNaqqsFIWd",
                    },
                    json={"text": message[i]},
                )
                json_response = await response.json()
                fetch_requests.append(json_response)
        return fetch_requests
    except Exception as e:
        pass

def getGroupedMessagesWithinXMin(data, minutes, lastXMessages):
    groupedMsg = ""
    for i in range(lastXMessages):
        if data["timestamp"].iloc[i] >= data["timestamp"].iloc[
            -1
        ] - datetime.timedelta(0, 60 * minutes):
            groupedMsg = groupedMsg + data["text"].iloc[i] + "\n"
    return groupedMsg

# Just 1 message at a time but pull requests setup with lists so use list
message = getGroupedMessagesWithinXMin(data, 5, 1)
array_of_messages = list([message])

async def textSummaryAndKeywordsExtractCall(array_of_messages):
    text_summarized = await textSummary(array_of_messages)
    text_extracted = await extractKeywords(array_of_messages)
    return [text_summarized, text_extracted]

async def getFinalString():
    global finalString
    finalString = (
        finalString
        + (await textSummaryAndKeywordsExtractCall(array_of_messages))[0][0][
            "prediction"
        ]
    )

asyncio.run(getFinalString())

def getLastRelevantMessage(data):
    relevantWords = [
        "warning",
        "attention",
        "meeting",
        "gathering",
        "group",
        "event",
        "announcment",
        "interesting",
    ]
    lastMsg = data["text"].iloc[-1].lower()
    for ele in relevantWords:
        if ele in lastMsg:
            return "Relevant Message:--- " + lastMsg

if getLastRelevantMessage(data) is not None:
    finalString = finalString + getLastRelevantMessage(data)

# Add final string to JSON object
newEntry = json.loads(newEntry)
newEntry["summary"] = finalString
newEntry = json.dumps(newEntry)

# Append JSON object to file
with open("data.txt", "a") as f:
    f.write(newEntry + "\n")
