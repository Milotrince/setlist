<script>
  let tag = "";
  let arrelementsmatch = [];
  let autoCompleteIndex = -1;

  let regExpEscape = (s) => {
    return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
  };

  export let tags;
  export let addKeys;
  export let maxTags;
  export let onlyUnique;
  export let removeKeys;
  export let placeholder;
  export let allowPaste;
  export let allowDrop;
  export let splitWith;
  export let autoComplete;
  export let autoCompleteFilter;
  export let autoCompleteKey;
  export let autoCompleteMarkupKey;
  export let name;
  export let id;
  export let allowBlur;
  export let disable;
  export let minChars;
  export let onlyAutocomplete;
  export let labelText;
  export let labelShow;
  export let readonly;
  export let onTagClick;
  export let autoCompleteShowKey;
  export let onTagAdded;
  export let onTagRemoved;
  export let cleanOnBlur;
  export let customValidation;

  let layoutElement;

  $: tags = tags || [];
  $: addKeys = addKeys || [13];
  $: maxTags = maxTags || false;
  $: onlyUnique = onlyUnique || false;
  $: removeKeys = removeKeys || [8];
  $: placeholder = placeholder || "";
  $: allowPaste = allowPaste || false;
  $: allowDrop = allowDrop || false;
  $: splitWith = splitWith || ",";
  $: autoComplete = autoComplete || false;
  $: autoCompleteFilter =
    typeof autoCompleteFilter == "undefined" ? true : false;
  $: autoCompleteKey = autoCompleteKey || false;
  $: autoCompleteMarkupKey = autoCompleteMarkupKey || false;
  $: name = name || "tags-input";
  $: id = id || uniqueID();
  $: allowBlur = allowBlur || false;
  $: disable = disable || false;
  $: minChars = minChars ?? 1;
  $: onlyAutocomplete = onlyAutocomplete || false;
  $: labelText = labelText || name;
  $: labelShow = labelShow || false;
  $: readonly = readonly || false;
  $: onTagClick = onTagClick || function () {};
  $: autoCompleteShowKey = autoCompleteShowKey || autoCompleteKey;
  $: onTagAdded = onTagAdded || function () {};
  $: onTagRemoved = onTagRemoved || function () {};
  $: cleanOnBlur = cleanOnBlur || false;
  $: customValidation = customValidation || false;

  $: matchsID = id + "_matchs";

  let storePlaceholder = placeholder;

  function setTag(e) {
    const currentTag = e.target.value;

    if (addKeys) {
      addKeys.forEach(function (key) {
        if (key === e.keyCode) {
          if (currentTag) e.preventDefault();
          if (
            autoComplete &&
            onlyAutocomplete &&
            document.getElementById(matchsID)
          ) {
            addTag(arrelementsmatch?.[autoCompleteIndex]?.label);
          } else {
            addTag(currentTag);
          }
        }
      });
    }

    if (removeKeys) {
      removeKeys.forEach(function (key) {
        if (key === e.keyCode && tag === "") {
          tags.pop();
          tags = tags;

          arrelementsmatch = [];
          document.getElementById(id).readOnly = false;
          placeholder = storePlaceholder;
          document.getElementById(id).focus();
        }
      });
    }

    // ArrowDown : focus on first element of the autocomplete
    if (e.keyCode === 40 && autoComplete && document.getElementById(matchsID)) {
      // Last element on the list ? Go to the first
      if (autoCompleteIndex + 1 === arrelementsmatch.length)
        autoCompleteIndex = 0;
      else autoCompleteIndex++;
    } else if (e.keyCode === 38) {
      // ArrowUp
      // First element on the list ? Go to the last
      if (autoCompleteIndex <= 0)
        autoCompleteIndex = arrelementsmatch.length - 1;
      else autoCompleteIndex--;
    } else if (e.keyCode === 27) {
      // Escape
      arrelementsmatch = [];
      document.getElementById(id).focus();
    }
  }

  function addTag(currentTag) {
    if (typeof currentTag === "object" && currentTag !== null) {
      if (!autoCompleteKey) {
        return console.error(
          "'autoCompleteKey' is necessary if 'autoComplete' result is an array of objects"
        );
      }

      if (onlyUnique) {
        let found = tags?.find(
          (elem) => elem[autoCompleteKey] === currentTag[autoCompleteKey]
        );

        if (found) return;
      }

      var currentObjTags = currentTag;
      currentTag = currentTag[autoCompleteKey].trim();
    } else {
      currentTag = currentTag.trim();
    }

    if (currentTag == "") return;
    if (maxTags && tags.length == maxTags) return;
    if (onlyUnique && tags.includes(currentTag)) return;
    if (onlyAutocomplete && arrelementsmatch.length === 0) return;

    if (customValidation && !customValidation(currentTag)) return;

    tags.push(currentObjTags ? currentObjTags : currentTag);
    tags = tags;
    tag = "";

    onTagAdded(currentTag, tags);

    // Hide autocomplete list
    // Focus on svelte tags input
    arrelementsmatch = [];
    autoCompleteIndex = -1;
    document.getElementById(id).focus();

    if (maxTags && tags.length == maxTags) {
      document.getElementById(id).readOnly = true;
      placeholder = "";
    }
  }

  function removeTag(i) {
    tags.splice(i, 1);
    onTagRemoved(tags[i], tags);
    tags = tags;

    // Hide autocomplete list
    // Focus on svelte tags input
    arrelementsmatch = [];
    document.getElementById(id).readOnly = false;
    placeholder = storePlaceholder;
    document.getElementById(id).focus();
  }

  function onPaste(e) {
    if (!allowPaste) return;
    e.preventDefault();

    const data = getClipboardData(e);
    splitTags(data).map((tag) => addTag(tag));
  }

  function onDrop(e) {
    if (!allowDrop) return;
    e.preventDefault();

    const data = e.dataTransfer.getData("Text");
    splitTags(data).map((tag) => addTag(tag));
  }

  function onFocus() {
    layoutElement.classList.add("focus");
  }

  function onBlur(e, currentTag) {
    layoutElement.classList.remove("focus");

    if (allowBlur) {
      // A match is highlighted
      if (arrelementsmatch.length && autoCompleteIndex > -1) {
        addTag(arrelementsmatch?.[autoCompleteIndex]?.label);
      }
      // There is no match, but we may add a new tag
      else if (!arrelementsmatch.length) {
        e.preventDefault();
        addTag(currentTag);
      }
    }

    // Clean input on
    if (cleanOnBlur) {
      tag = "";
    }

    arrelementsmatch = [];
    autoCompleteIndex = -1;
  }

  function onClick() {
    minChars == 0 && getMatchElements();
  }

  function getClipboardData(e) {
    if (window.clipboardData) {
      return window.clipboardData.getData("Text");
    }

    if (e.clipboardData) {
      return e.clipboardData.getData("text/plain");
    }

    return "";
  }

  function splitTags(data) {
    return data.split(splitWith).map((tag) => tag.trim());
  }

  function escapeHTML(string) {
    const htmlEscapes = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "/": "&#x2F;",
    };
    return ("" + string).replace(/[&<>"'\/]/g, (match) => htmlEscapes[match]);
  }

  function buildMatchMarkup(search, value) {
    return escapeHTML(value).replace(
      RegExp(regExpEscape(search.toLowerCase()), "i"),
      "<strong>$&</strong>"
    );
  }

  async function getMatchElements(input) {
    if (!autoComplete) return;
    if (maxTags && tags.length >= maxTags) return;

    let value = input ? input.target.value : "";
    let autoCompleteValues = [];

    if (Array.isArray(autoComplete)) {
      autoCompleteValues = autoComplete;
    }

    if (typeof autoComplete === "function") {
      if (autoComplete.constructor.name === "AsyncFunction") {
        autoCompleteValues = await autoComplete(value);
      } else {
        autoCompleteValues = autoComplete(value);
      }
    }

    if (autoCompleteValues.constructor.name === "Promise") {
      autoCompleteValues = await autoCompleteValues;
    }
    // Escape
    if (
      (minChars > 0 && value == "") ||
      (input && input.keyCode === 27) ||
      value.length < minChars
    ) {
      arrelementsmatch = [];
      return;
    }

    let matchs = autoCompleteValues;

    if (
      typeof autoCompleteValues[0] === "object" &&
      autoCompleteValues !== null
    ) {
      if (!autoCompleteKey) {
        return console.error(
          "'autoCompleteValue' is necessary if 'autoComplete' result is an array of objects"
        );
      }

      if (autoCompleteFilter !== false) {
        matchs = autoCompleteValues.filter((e) =>
          e[autoCompleteKey].toLowerCase().includes(value.toLowerCase())
        );
      }
      matchs = matchs.map((matchTag) => {
        return {
          label: matchTag,
          search: autoCompleteMarkupKey
            ? matchTag[autoCompleteMarkupKey]
            : buildMatchMarkup(value, matchTag[autoCompleteKey]),
        };
      });
    } else {
      if (autoCompleteFilter !== false) {
        matchs = autoCompleteValues.filter((e) =>
          String(e).toLowerCase().includes(value.toLowerCase())
        );
      }
      matchs = matchs.map((matchTag) => {
        return {
          label: matchTag,
          search: buildMatchMarkup(value, matchTag),
        };
      });
    }

    if (onlyUnique === true && !autoCompleteKey) {
      matchs = matchs.filter((tag) => !tags.includes(tag.label));
    }

    arrelementsmatch = matchs;
  }

  function uniqueID() {
    return "sti_" + Math.random().toString(36).substring(2, 11);
  }
</script>

<div
  class="tags-input-layout"
  class:sti-layout-disable={disable}
  class:sti-layout-readonly={readonly}
  bind:this={layoutElement}
>
  <label for={id} class={labelShow ? "" : "sr-only"}>{labelText}</label>

  {#if tags.length > 0}
    {#each tags as tag, i}
      <button
        type="button"
        class="tags-input-tag"
        on:click={onTagClick(tag)}
      >
        {#if typeof tag === "string"}
          {tag}
        {:else}
          {tag[autoCompleteShowKey]}
        {/if}
        {#if !disable && !readonly}
          <span
            class="tags-input-tag-remove"
            on:pointerdown={() => removeTag(i)}
          >
            &#215;</span
          >
        {/if}
      </button>
    {/each}
  {/if}
  <input
    type="text"
    {id}
    {name}
    bind:value={tag}
    on:keydown={setTag}
    on:keyup={getMatchElements}
    on:paste={onPaste}
    on:drop={onDrop}
    on:focus={onFocus}
    on:blur={(e) => onBlur(e, tag)}
    on:pointerdown={onClick}
    class="tags-input"
    {placeholder}
    disabled={disable || readonly}
    autocomplete="off"
  />
</div>

{#if autoComplete && arrelementsmatch.length > 0}
  <div class="tags-input-matchs-parent">
    <ul id="{id}_matchs" class="tags-input-matchs">
      {#each arrelementsmatch as element, index}
        <li
          tabindex="-1"
          class:focus={index === autoCompleteIndex}
          on:pointerdown|preventDefault={() => addTag(element.label)}
        >
          {@html element.search}
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style lang="sass">
.tags-input, .tags-input-tag, .tags-input-matchs
  color: var(--text)
  padding: 2px 4px
  font-family: "Nanum Gothic Coding", monospace
  border-radius: 2px

.tags-input-layout
  width: 404px
  display: -webkit-box
  display: -ms-flexbox
  display: flex
  flex-direction: row
  -ms-flex-wrap: wrap
  flex-wrap: wrap
  -webkit-box-align: center
  -ms-flex-align: center
  align-items: center
  padding: 0px 2px 2px 2px
  border: 1px solid var(--border)
  border-radius: 2px
  font-size: 1em

  &:focus-within
    outline: 5px auto $secondary

  label
    padding: 2px 2px
    margin: 4px 2px 0 0
    padding: 0

.tags-input
  background: unset
  -webkit-box-flex: 1
  -ms-flex: 1
  flex: 1
  margin: 0
  margin-top: 5px
  border: none

  &:focus
    outline: 0

.tags-input-tag
  cursor: text
  display: -webkit-box
  display: -ms-flexbox
  display: flex
  white-space: nowrap
  user-select: text
  list-style: none
  border: none
  border-radius: 2px
  margin-right: 2px
  margin-top: 2px

.tags-input-tag-remove
  cursor: pointer
  margin-left: 4px

.tags-input-matchs-parent
  position: relative

.tags-input-matchs
  position: absolute
  top: 0
  left: 0
  right: 0
  margin: 3px 0
  padding: 0px
  border: solid 1px #ccc
  border-radius: 2px
  max-height: 310px
  overflow: scroll
  overflow-x: auto

  li
    background: var(--background)
    list-style: none
    padding: 5px
    border-radius: 2px
    cursor: pointer
    &:hover, &.focus
      background: var(--button)
      color: var(--text)
      outline: none

.tags-input:disabled
  background: transparent

.tags-input-layout
  &.sti-layout-disable
    cursor: not-allowed
    background: #eaeaea

    input
      cursor: not-allowed
      background: #eaeaea

    &:hover, &:focus
      border-color: #ccc

  &.sti-layout-readonly
    &:hover, &:focus
      border-color: #ccc

  &.sti-layout-disable
    .tags-input-tag
      background: #aeaeae

    .tags-input-tag-remove
      cursor: not-allowed

  label.sr-only
    position: absolute
    width: 1px
    height: 1px
    padding: 0
    margin: -1px
    overflow: hidden
    clip: rect(0, 0, 0, 0)
    white-space: nowrap
    border: 0


</style>
