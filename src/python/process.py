import sys
import json

# Check if the second argument is a JSON string
try:
    json.loads(sys.argv[1])
    print(sys.argv[1])
except ValueError:
    print("[]")
