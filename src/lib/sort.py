import json

def count_xs(fingering):
    return fingering.count('x')

def max_number(fingering):
    numbers = [int(f) for f in fingering.split() if f != 'x']
    return max(numbers) if numbers else float('inf')

def sort_chords(chords):
    return sorted(chords, key=lambda f: (count_xs(f), max_number(f)))

def main():
    # Read the input JSON file
    with open('chords.json', 'r') as file:
        chords_data = json.load(file)
    
    # Sort the chords based on the criteria
    sorted_chords_data = {chord: sort_chords(fingerings) for chord, fingerings in chords_data.items()}
    
    # Write the sorted chords to the output JSON file
    with open('sorted_chords.json', 'w') as file:
        json.dump(sorted_chords_data, file, indent=4)

if __name__ == "__main__":
    main()
