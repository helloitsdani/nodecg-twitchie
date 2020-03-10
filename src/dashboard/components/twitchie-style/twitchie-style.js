const styleElement = document.createElement('dom-module')

styleElement.innerHTML = `<template>
  <style>
    h1,
    h2,
    h3,
    h4 {
      margin: 0 auto 0.5rem;
    }

    h5 {
      margin: 0 auto;
      font-size: 1em;
    }

    paper-button {
      display: flex;
      flex-flow: row nowrap;
      flex-direction: row;

      background: #6441a4;
      color: #fff;
      text-align: center;
    }

    paper-button iron-icon {
      margin: 0 0.5em 0 0;
    }

    paper-icon-button {
      color: #6441a4;
      width: 1.5em;
      height: 1.5em;
      padding: 0;
    }

    paper-spinner {
      --paper-spinner-layer-1-color: #6441a5;
      --paper-spinner-layer-2-color: var(--paper-spinner-layer-1-color);
      --paper-spinner-layer-3-color: var(--paper-spinner-layer-1-color);
      --paper-spinner-layer-4-color: var(--paper-spinner-layer-1-color);
    }

    paper-checkbox {
      --paper-checkbox-size: 1.5em;
    }

    iron-icon {
      --iron-icon-width: 1em;
      --iron-icon-height: 1em;
    }

    section {
      position: relative;
    }

    .c-flush-input {
      margin: -8px 0;
    }

    .c-field-group {
      display: flex;
      flex-flow: row nowrap;
      flex-direction: row;
      margin: 0 auto 1em;
    }

    .c-field-group .c-field-group__field {
      margin-right: 1em;
      flex-grow: 1;
      flex-basis: 100%;
    }

    .c-field-group .c-field-group__field:last-child {
      margin-right: 0;
    }

    .c-loading {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      display: flex;
      align-items: center;
      justify-content: center;

      background: #f5f5f5;
      opacity: 0;
      visibility: hidden;
      transition: 0.3s all ease-in-out;
    }

    .c-loading.is-loading {
      visibility: visible;
      opacity: 1;
    }

    .c-loading__message {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .c-loading__spinner {
      margin: 0 0.5em 0 0;
    }
  </style>
</template>`

styleElement.register('twitchie-style')
