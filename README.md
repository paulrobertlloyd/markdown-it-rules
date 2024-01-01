# @paulrobertlloyd/markdown-it-rules · [![test](https://github.com/paulrobertlloyd/markdown-it-rules/actions/workflows/test.yml/badge.svg)](https://github.com/paulrobertlloyd/markdown-it-rules/actions/workflows/test.yml)

[`markdown-it`](https://github.com/markdown-it/markdown-it) rules for my personal website.

## Requirements

Node.js v20 or later.

## Installation

> [!WARNING]
> Work in progress. Package can be installed directly from this repository.

`npm install paulrobertlloyd/markdown-it-rules`

## Usage

### Cited works

Titles of cited works can be marked down as follows:

```md
""Everything Everywhere All at Once"" is the multiverse done right.
```

```html
<p>
  <cite>Everything Everywhere All at Once</cite> is the multiverse done right.
</p>
```

### Linked embeds

Links to YouTube videos are rendered inside a `<figure>` with a thumbnail and a prompt to watch on YouTube, in a new tab:

```md
[Paul McCartney - I’ve Got a Feeling (feat. John Lennon)](https://www.youtube.com/watch?v=g4UsXksoGNg)
```

```html
<figure class="embed">
  <a
    href="https://www.youtube.com/watch?v=g4UsXksoGNg"
    rel="noreferrer noopener"
    target="_blank"
  >
    <img
      src="https://img.youtube.com/vi/g4UsXksoGNg/mqdefault.jpg"
      alt=""
      loading="lazy"
    />
    <p>
      Paul McCartney – I’ve Got a Feeling<br />
      <span>Watch on youtube.com (opens in a new tab)</span>
    </p>
  </a>
</figure>
```

Links to Vimeo videos are rendered inside a `<figure>` and include a prompt to watch on Vimeo, in a new tab:

```md
[The illusion of life](https://vimeo.com/93206523)
```

```html
<figure class="embed">
  <a
    href="https://vimeo.com/93206523"
    rel="noreferrer noopener"
    target="_blank"
  >
    <p>
      The illusion of life<br />
      <span>Watch on vimeo.com (opens in a new tab)</span>
    </p>
  </a>
</figure>
```

To learn more about this Markdown rule, see the post [Thinking out loud about embedding content](https://paulrobertlloyd.com/2023/098/a1/embedding/).
