export function songPreprocessor(fileRegex = /\/songs\/.*\.md$/) {
  return {
    markup({ content, filename }) {
      if (!fileRegex.test(filename)) {
        return {
          code: content
        };
      }

      const delimiter = '---\n';
      const text = content.split(delimiter);
      var song = text.slice(2).join("\n");

      const sectionRegex = /\[.+?\]/g;
      song = song.replace(sectionRegex, (match) => `<b>${match}</b>`);

      const chordRegex = /\b([A-G][#b]?(sus|maj|min|aug|dim|m|M)?[0-9]?\/?[A-G]?[#b]?)(?!\|)/g;
      song = song.replace(chordRegex, (match) => `<Chord chord="${match}" />`);

      content = [
        text[0],
        delimiter,
        text[1],
        delimiter,
        "<script> import Chord from '../components/Chord.svelte'; </script>",
        "<pre>",
        song,
        "</pre>",
      ].join("\n");

      return {
        code: content
      };
    }
  };
}
