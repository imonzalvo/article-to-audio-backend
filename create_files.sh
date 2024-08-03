#!/bin/bash

# Check if a filename is provided
if [ $# -eq 0 ]; then
    echo "Please provide a filename as an argument."
    exit 1
fi

input_file="$1"

# Check if the input file exists
if [ ! -f "$input_file" ]; then
    echo "File not found: $input_file"
    exit 1
fi

# Initialize variables
current_file=""
content=""

# Read the input file line by line
while IFS= read -r line || [ -n "$line" ]; do
    # Check if the line starts with "// File:"
    if [[ $line == "// File:"* ]]; then
        # If we have a current file, create it with the collected content
        if [ -n "$current_file" ]; then
            mkdir -p "$(dirname "$current_file")"
            echo "$content" > "$current_file"
            echo "Created file: $current_file"
            content=""
        fi
        # Extract the new filename
        current_file=$(echo "$line" | sed 's/\/\/ File: //')
        current_file=$(echo "$current_file" | sed 's/^[[:space:]]*//')
    else
        # Append the line to the content
        content+="$line"$'\n'
    fi
done < "$input_file"

# Create the last file
if [ -n "$current_file" ]; then
    mkdir -p "$(dirname "$current_file")"
    echo "$content" > "$current_file"
    echo "Created file: $current_file"
fi

echo "All files have been created successfully."
