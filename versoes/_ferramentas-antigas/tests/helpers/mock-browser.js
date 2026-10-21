/**
 * LIGHTWEIGHT IN-MEMORY BROWSER ENVIRONMENT FOR NODE.JS
 * Leonardo Arruda 2026+ E2E Testing Track
 */
const vm = require('node:vm');

function createBrowserContext(customGlobals = {}) {
  const storage = new Map();
  const listeners = new Map();

  const mockLocalStorage = {
    getItem: (key) => storage.get(String(key)) ?? null,
    setItem: (key, val) => storage.set(String(key), String(val)),
    removeItem: (key) => storage.delete(String(key)),
    clear: () => storage.clear()
  };

  const mockElement = (tag = 'div', id = '', className = '') => {
    const styleObj = {};
    const attributes = new Map();
    const children = [];
    return {
      tagName: tag.toUpperCase(),
      id,
      className,
      style: styleObj,
      dataset: {},
      innerHTML: '',
      textContent: '',
      children,
      classList: {
        add: (...c) => { className = `${className} ${c.join(' ')}`.trim(); },
        remove: (...c) => {
          c.forEach(cls => {
            className = className.replace(new RegExp(`\\b${cls}\\b`, 'g'), '').trim();
          });
        },
        contains: (cls) => className.split(/\s+/).includes(cls)
      },
      setAttribute: (k, v) => attributes.set(k, String(v)),
      getAttribute: (k) => attributes.get(k) ?? null,
      removeAttribute: (k) => attributes.delete(k),
      appendChild: (child) => { children.push(child); return child; },
      addEventListener: (evt, fn) => {
        if (!listeners.has(evt)) listeners.set(evt, []);
        listeners.get(evt).push(fn);
      },
      querySelector: () => null,
      querySelectorAll: () => []
    };
  };

  const mockDocument = {
    readyState: 'complete',
    documentElement: {
      scrollHeight: 2000,
      clientHeight: 800,
      scrollTop: 0
    },
    body: mockElement('body'),
    createElement: (tag) => mockElement(tag),
    getElementById: (id) => mockElement('div', id),
    querySelector: (sel) => mockElement('div'),
    querySelectorAll: (sel) => [],
    addEventListener: (evt, fn) => {
      if (!listeners.has(evt)) listeners.set(evt, []);
      listeners.get(evt).push(fn);
    }
  };

  const mockWindow = {
    innerWidth: 1440,
    innerHeight: 900,
    scrollY: 0,
    pageYOffset: 0,
    location: {
      pathname: '/index.html',
      href: 'https://leonardoarruda.com.br/index.html',
      search: '',
      hash: ''
    },
    document: mockDocument,
    localStorage: mockLocalStorage,
    addEventListener: (evt, fn) => {
      if (!listeners.has(evt)) listeners.set(evt, []);
      listeners.get(evt).push(fn);
    },
    requestAnimationFrame: (cb) => setTimeout(cb, 16),
    cancelAnimationFrame: (id) => clearTimeout(id),
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    console
  };

  const sandbox = {
    window: mockWindow,
    document: mockDocument,
    localStorage: mockLocalStorage,
    location: mockWindow.location,
    console,
    Math,
    Date,
    Array,
    Object,
    String,
    Number,
    Boolean,
    RegExp,
    JSON,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    ...customGlobals
  };

  sandbox.global = sandbox.window;
  sandbox.globalThis = sandbox.window;
  sandbox.self = sandbox.window;

  return vm.createContext(sandbox);
}

function runScriptInBrowser(scriptContent, filename = 'script.js', customGlobals = {}) {
  const context = createBrowserContext(customGlobals);
  vm.runInContext(scriptContent, context, { filename, timeout: 5000 });
  return context;
}

module.exports = {
  createBrowserContext,
  runScriptInBrowser
};
