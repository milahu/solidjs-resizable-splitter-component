true&&(function polyfill() {
    const relList = document.createElement('link').relList;
    if (relList && relList.supports && relList.supports('modulepreload')) {
        return;
    }
    for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
        processPreload(link);
    }
    new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type !== 'childList') {
                continue;
            }
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'LINK' && node.rel === 'modulepreload')
                    processPreload(node);
            }
        }
    }).observe(document, { childList: true, subtree: true });
    function getFetchOpts(script) {
        const fetchOpts = {};
        if (script.integrity)
            fetchOpts.integrity = script.integrity;
        if (script.referrerpolicy)
            fetchOpts.referrerPolicy = script.referrerpolicy;
        if (script.crossorigin === 'use-credentials')
            fetchOpts.credentials = 'include';
        else if (script.crossorigin === 'anonymous')
            fetchOpts.credentials = 'omit';
        else
            fetchOpts.credentials = 'same-origin';
        return fetchOpts;
    }
    function processPreload(link) {
        if (link.ep)
            // ep marker = processed
            return;
        link.ep = true;
        // prepopulate the load record
        const fetchOpts = getFetchOpts(link);
        fetch(link.href, fetchOpts);
    }
}());

const sharedConfig$1 = {};
let runEffects$1 = runQueue$1;
const STALE$1 = 1;
const PENDING$1 = 2;
const UNOWNED$1 = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var Owner$1 = null;
let Transition$1 = null;
let Listener$1 = null;
let Updates$1 = null;
let Effects$1 = null;
let ExecCount$1 = 0;
function createRoot(fn, detachedOwner) {
  const listener = Listener$1,
        owner = Owner$1,
        unowned = fn.length === 0,
        root = unowned && !false ? UNOWNED$1 : {
    owned: null,
    cleanups: null,
    context: null,
    owner: detachedOwner || owner
  },
        updateFn = unowned ? fn : () => fn(() => untrack$1(() => cleanNode$1(root)));
  Owner$1 = root;
  Listener$1 = null;
  try {
    return runUpdates$1(updateFn, true);
  } finally {
    Listener$1 = listener;
    Owner$1 = owner;
  }
}
function createRenderEffect$1(fn, value, options) {
  const c = createComputation$1(fn, value, false, STALE$1);
  updateComputation$1(c);
}
function untrack$1(fn) {
  let result,
      listener = Listener$1;
  Listener$1 = null;
  result = fn();
  Listener$1 = listener;
  return result;
}
function writeSignal$1(node, value, isComp) {
  let current = node.value;
  if (!node.comparator || !node.comparator(current, value)) {
    node.value = value;
    if (node.observers && node.observers.length) {
      runUpdates$1(() => {
        for (let i = 0; i < node.observers.length; i += 1) {
          const o = node.observers[i];
          const TransitionRunning = Transition$1 && Transition$1.running;
          if (TransitionRunning && Transition$1.disposed.has(o)) ;
          if (TransitionRunning && !o.tState || !TransitionRunning && !o.state) {
            if (o.pure) Updates$1.push(o);else Effects$1.push(o);
            if (o.observers) markDownstream$1(o);
          }
          if (TransitionRunning) ;else o.state = STALE$1;
        }
        if (Updates$1.length > 10e5) {
          Updates$1 = [];
          if (false) ;
          throw new Error();
        }
      }, false);
    }
  }
  return value;
}
function updateComputation$1(node) {
  if (!node.fn) return;
  cleanNode$1(node);
  const owner = Owner$1,
        listener = Listener$1,
        time = ExecCount$1;
  Listener$1 = Owner$1 = node;
  runComputation$1(node, node.value, time);
  Listener$1 = listener;
  Owner$1 = owner;
}
function runComputation$1(node, value, time) {
  let nextValue;
  try {
    nextValue = node.fn(value);
  } catch (err) {
    if (node.pure) node.state = STALE$1;
    handleError$1(err);
  }
  if (!node.updatedAt || node.updatedAt <= time) {
    if (node.updatedAt != null && "observers" in node) {
      writeSignal$1(node, nextValue);
    } else node.value = nextValue;
    node.updatedAt = time;
  }
}
function createComputation$1(fn, init, pure, state = STALE$1, options) {
  const c = {
    fn,
    state: state,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: init,
    owner: Owner$1,
    context: null,
    pure
  };
  if (Owner$1 === null) ;else if (Owner$1 !== UNOWNED$1) {
    {
      if (!Owner$1.owned) Owner$1.owned = [c];else Owner$1.owned.push(c);
    }
  }
  return c;
}
function runTop$1(node) {
  const runningTransition = Transition$1 ;
  if (node.state === 0 || runningTransition ) return;
  if (node.state === PENDING$1 || runningTransition ) return lookUpstream$1(node);
  if (node.suspense && untrack$1(node.suspense.inFallback)) return node.suspense.effects.push(node);
  const ancestors = [node];
  while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount$1)) {
    if (node.state || runningTransition ) ancestors.push(node);
  }
  for (let i = ancestors.length - 1; i >= 0; i--) {
    node = ancestors[i];
    if (node.state === STALE$1 || runningTransition ) {
      updateComputation$1(node);
    } else if (node.state === PENDING$1 || runningTransition ) {
      const updates = Updates$1;
      Updates$1 = null;
      runUpdates$1(() => lookUpstream$1(node, ancestors[0]), false);
      Updates$1 = updates;
    }
  }
}
function runUpdates$1(fn, init) {
  if (Updates$1) return fn();
  let wait = false;
  if (!init) Updates$1 = [];
  if (Effects$1) wait = true;else Effects$1 = [];
  ExecCount$1++;
  try {
    const res = fn();
    completeUpdates$1(wait);
    return res;
  } catch (err) {
    if (!Updates$1) Effects$1 = null;
    handleError$1(err);
  }
}
function completeUpdates$1(wait) {
  if (Updates$1) {
    runQueue$1(Updates$1);
    Updates$1 = null;
  }
  if (wait) return;
  const e = Effects$1;
  Effects$1 = null;
  if (e.length) runUpdates$1(() => runEffects$1(e), false);
}
function runQueue$1(queue) {
  for (let i = 0; i < queue.length; i++) runTop$1(queue[i]);
}
function lookUpstream$1(node, ignore) {
  const runningTransition = Transition$1 ;
  node.state = 0;
  for (let i = 0; i < node.sources.length; i += 1) {
    const source = node.sources[i];
    if (source.sources) {
      if (source.state === STALE$1 || runningTransition ) {
        if (source !== ignore) runTop$1(source);
      } else if (source.state === PENDING$1 || runningTransition ) lookUpstream$1(source, ignore);
    }
  }
}
function markDownstream$1(node) {
  const runningTransition = Transition$1 ;
  for (let i = 0; i < node.observers.length; i += 1) {
    const o = node.observers[i];
    if (!o.state || runningTransition ) {
      o.state = PENDING$1;
      if (o.pure) Updates$1.push(o);else Effects$1.push(o);
      o.observers && markDownstream$1(o);
    }
  }
}
function cleanNode$1(node) {
  let i;
  if (node.sources) {
    while (node.sources.length) {
      const source = node.sources.pop(),
            index = node.sourceSlots.pop(),
            obs = source.observers;
      if (obs && obs.length) {
        const n = obs.pop(),
              s = source.observerSlots.pop();
        if (index < obs.length) {
          n.sourceSlots[s] = index;
          obs[index] = n;
          source.observerSlots[index] = s;
        }
      }
    }
  }
  if (node.owned) {
    for (i = 0; i < node.owned.length; i++) cleanNode$1(node.owned[i]);
    node.owned = null;
  }
  if (node.cleanups) {
    for (i = 0; i < node.cleanups.length; i++) node.cleanups[i]();
    node.cleanups = null;
  }
  node.state = 0;
  node.context = null;
}
function castError$1(err) {
  if (err instanceof Error || typeof err === "string") return err;
  return new Error("Unknown error");
}
function handleError$1(err) {
  err = castError$1(err);
  throw err;
}
function createComponent$1(Comp, props) {
  return untrack$1(() => Comp(props || {}));
}

function reconcileArrays$1(parentNode, a, b) {
  let bLength = b.length,
      aEnd = a.length,
      bEnd = bLength,
      aStart = 0,
      bStart = 0,
      after = a[aEnd - 1].nextSibling,
      map = null;
  while (aStart < aEnd || bStart < bEnd) {
    if (a[aStart] === b[bStart]) {
      aStart++;
      bStart++;
      continue;
    }
    while (a[aEnd - 1] === b[bEnd - 1]) {
      aEnd--;
      bEnd--;
    }
    if (aEnd === aStart) {
      const node = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after;
      while (bStart < bEnd) parentNode.insertBefore(b[bStart++], node);
    } else if (bEnd === bStart) {
      while (aStart < aEnd) {
        if (!map || !map.has(a[aStart])) a[aStart].remove();
        aStart++;
      }
    } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
      const node = a[--aEnd].nextSibling;
      parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
      parentNode.insertBefore(b[--bEnd], node);
      a[aEnd] = b[bEnd];
    } else {
      if (!map) {
        map = new Map();
        let i = bStart;
        while (i < bEnd) map.set(b[i], i++);
      }
      const index = map.get(a[aStart]);
      if (index != null) {
        if (bStart < index && index < bEnd) {
          let i = aStart,
              sequence = 1,
              t;
          while (++i < aEnd && i < bEnd) {
            if ((t = map.get(a[i])) == null || t !== index + sequence) break;
            sequence++;
          }
          if (sequence > index - bStart) {
            const node = a[aStart];
            while (bStart < index) parentNode.insertBefore(b[bStart++], node);
          } else parentNode.replaceChild(b[bStart++], a[aStart++]);
        } else aStart++;
      } else a[aStart++].remove();
    }
  }
}
function render(code, element, init) {
  let disposer;
  createRoot(dispose => {
    disposer = dispose;
    element === document ? code() : insert$1(element, code(), element.firstChild ? null : undefined, init);
  });
  return () => {
    disposer();
    element.textContent = "";
  };
}
function template$1(html, check, isSVG) {
  const t = document.createElement("template");
  t.innerHTML = html;
  let node = t.content.firstChild;
  if (isSVG) node = node.firstChild;
  return node;
}
function insert$1(parent, accessor, marker, initial) {
  if (marker !== undefined && !initial) initial = [];
  if (typeof accessor !== "function") return insertExpression$1(parent, accessor, initial, marker);
  createRenderEffect$1(current => insertExpression$1(parent, accessor(), current, marker), initial);
}
function insertExpression$1(parent, value, current, marker, unwrapArray) {
  if (sharedConfig$1.context && !current) current = [...parent.childNodes];
  while (typeof current === "function") current = current();
  if (value === current) return current;
  const t = typeof value,
        multi = marker !== undefined;
  parent = multi && current[0] && current[0].parentNode || parent;
  if (t === "string" || t === "number") {
    if (sharedConfig$1.context) return current;
    if (t === "number") value = value.toString();
    if (multi) {
      let node = current[0];
      if (node && node.nodeType === 3) {
        node.data = value;
      } else node = document.createTextNode(value);
      current = cleanChildren$1(parent, current, marker, node);
    } else {
      if (current !== "" && typeof current === "string") {
        current = parent.firstChild.data = value;
      } else current = parent.textContent = value;
    }
  } else if (value == null || t === "boolean") {
    if (sharedConfig$1.context) return current;
    current = cleanChildren$1(parent, current, marker);
  } else if (t === "function") {
    createRenderEffect$1(() => {
      let v = value();
      while (typeof v === "function") v = v();
      current = insertExpression$1(parent, v, current, marker);
    });
    return () => current;
  } else if (Array.isArray(value)) {
    const array = [];
    const currentArray = current && Array.isArray(current);
    if (normalizeIncomingArray$1(array, value, current, unwrapArray)) {
      createRenderEffect$1(() => current = insertExpression$1(parent, array, current, marker, true));
      return () => current;
    }
    if (sharedConfig$1.context) {
      if (!array.length) return current;
      for (let i = 0; i < array.length; i++) {
        if (array[i].parentNode) return current = array;
      }
    }
    if (array.length === 0) {
      current = cleanChildren$1(parent, current, marker);
      if (multi) return current;
    } else if (currentArray) {
      if (current.length === 0) {
        appendNodes$1(parent, array, marker);
      } else reconcileArrays$1(parent, current, array);
    } else {
      current && cleanChildren$1(parent);
      appendNodes$1(parent, array);
    }
    current = array;
  } else if (value instanceof Node) {
    if (sharedConfig$1.context && value.parentNode) return current = multi ? [value] : value;
    if (Array.isArray(current)) {
      if (multi) return current = cleanChildren$1(parent, current, marker, value);
      cleanChildren$1(parent, current, null, value);
    } else if (current == null || current === "" || !parent.firstChild) {
      parent.appendChild(value);
    } else parent.replaceChild(value, parent.firstChild);
    current = value;
  } else ;
  return current;
}
function normalizeIncomingArray$1(normalized, array, current, unwrap) {
  let dynamic = false;
  for (let i = 0, len = array.length; i < len; i++) {
    let item = array[i],
        prev = current && current[i];
    if (item instanceof Node) {
      normalized.push(item);
    } else if (item == null || item === true || item === false) ; else if (Array.isArray(item)) {
      dynamic = normalizeIncomingArray$1(normalized, item, prev) || dynamic;
    } else if ((typeof item) === "function") {
      if (unwrap) {
        while (typeof item === "function") item = item();
        dynamic = normalizeIncomingArray$1(normalized, Array.isArray(item) ? item : [item], Array.isArray(prev) ? prev : [prev]) || dynamic;
      } else {
        normalized.push(item);
        dynamic = true;
      }
    } else {
      const value = String(item);
      if (prev && prev.nodeType === 3 && prev.data === value) {
        normalized.push(prev);
      } else normalized.push(document.createTextNode(value));
    }
  }
  return dynamic;
}
function appendNodes$1(parent, array, marker) {
  for (let i = 0, len = array.length; i < len; i++) parent.insertBefore(array[i], marker);
}
function cleanChildren$1(parent, current, marker, replacement) {
  if (marker === undefined) return parent.textContent = "";
  const node = replacement || document.createTextNode("");
  if (current.length) {
    let inserted = false;
    for (let i = current.length - 1; i >= 0; i--) {
      const el = current[i];
      if (node !== el) {
        const isParent = el.parentNode === parent;
        if (!inserted && !i) isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);else isParent && el.remove();
      } else inserted = true;
    }
  } else parent.insertBefore(node, marker);
  return [node];
}

const sharedConfig = {};
function setHydrateContext(context) {
  sharedConfig.context = context;
}

const equalFn = (a, b) => a === b;
const signalOptions = {
  equals: equalFn
};
let runEffects = runQueue;
const STALE = 1;
const PENDING = 2;
const UNOWNED = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var Owner = null;
let Transition = null;
let Listener = null;
let Updates = null;
let Effects = null;
let ExecCount = 0;
function createRenderEffect(fn, value, options) {
  const c = createComputation(fn, value, false, STALE);
  updateComputation(c);
}
function createEffect(fn, value, options) {
  runEffects = runUserEffects;
  const c = createComputation(fn, value, false, STALE);
  c.user = true;
  Effects ? Effects.push(c) : updateComputation(c);
}
function createMemo(fn, value, options) {
  options = options ? Object.assign({}, signalOptions, options) : signalOptions;
  const c = createComputation(fn, value, true, 0);
  c.observers = null;
  c.observerSlots = null;
  c.comparator = options.equals || undefined;
  updateComputation(c);
  return readSignal.bind(c);
}
function untrack(fn) {
  let result,
      listener = Listener;
  Listener = null;
  result = fn();
  Listener = listener;
  return result;
}
function onMount(fn) {
  createEffect(() => untrack(fn));
}
function onCleanup(fn) {
  if (Owner === null) ;else if (Owner.cleanups === null) Owner.cleanups = [fn];else Owner.cleanups.push(fn);
  return fn;
}
function children(fn) {
  const children = createMemo(fn);
  const memo = createMemo(() => resolveChildren(children()));
  memo.toArray = () => {
    const c = memo();
    return Array.isArray(c) ? c : c != null ? [c] : [];
  };
  return memo;
}
function readSignal() {
  const runningTransition = Transition ;
  if (this.sources && (this.state || runningTransition )) {
    if (this.state === STALE || runningTransition ) updateComputation(this);else {
      const updates = Updates;
      Updates = null;
      runUpdates(() => lookUpstream(this), false);
      Updates = updates;
    }
  }
  if (Listener) {
    const sSlot = this.observers ? this.observers.length : 0;
    if (!Listener.sources) {
      Listener.sources = [this];
      Listener.sourceSlots = [sSlot];
    } else {
      Listener.sources.push(this);
      Listener.sourceSlots.push(sSlot);
    }
    if (!this.observers) {
      this.observers = [Listener];
      this.observerSlots = [Listener.sources.length - 1];
    } else {
      this.observers.push(Listener);
      this.observerSlots.push(Listener.sources.length - 1);
    }
  }
  return this.value;
}
function writeSignal(node, value, isComp) {
  let current = node.value;
  if (!node.comparator || !node.comparator(current, value)) {
    node.value = value;
    if (node.observers && node.observers.length) {
      runUpdates(() => {
        for (let i = 0; i < node.observers.length; i += 1) {
          const o = node.observers[i];
          const TransitionRunning = Transition && Transition.running;
          if (TransitionRunning && Transition.disposed.has(o)) ;
          if (TransitionRunning && !o.tState || !TransitionRunning && !o.state) {
            if (o.pure) Updates.push(o);else Effects.push(o);
            if (o.observers) markDownstream(o);
          }
          if (TransitionRunning) ;else o.state = STALE;
        }
        if (Updates.length > 10e5) {
          Updates = [];
          if (false) ;
          throw new Error();
        }
      }, false);
    }
  }
  return value;
}
function updateComputation(node) {
  if (!node.fn) return;
  cleanNode(node);
  const owner = Owner,
        listener = Listener,
        time = ExecCount;
  Listener = Owner = node;
  runComputation(node, node.value, time);
  Listener = listener;
  Owner = owner;
}
function runComputation(node, value, time) {
  let nextValue;
  try {
    nextValue = node.fn(value);
  } catch (err) {
    if (node.pure) node.state = STALE;
    handleError(err);
  }
  if (!node.updatedAt || node.updatedAt <= time) {
    if (node.updatedAt != null && "observers" in node) {
      writeSignal(node, nextValue);
    } else node.value = nextValue;
    node.updatedAt = time;
  }
}
function createComputation(fn, init, pure, state = STALE, options) {
  const c = {
    fn,
    state: state,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: init,
    owner: Owner,
    context: null,
    pure
  };
  if (Owner === null) ;else if (Owner !== UNOWNED) {
    {
      if (!Owner.owned) Owner.owned = [c];else Owner.owned.push(c);
    }
  }
  return c;
}
function runTop(node) {
  const runningTransition = Transition ;
  if (node.state === 0 || runningTransition ) return;
  if (node.state === PENDING || runningTransition ) return lookUpstream(node);
  if (node.suspense && untrack(node.suspense.inFallback)) return node.suspense.effects.push(node);
  const ancestors = [node];
  while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
    if (node.state || runningTransition ) ancestors.push(node);
  }
  for (let i = ancestors.length - 1; i >= 0; i--) {
    node = ancestors[i];
    if (node.state === STALE || runningTransition ) {
      updateComputation(node);
    } else if (node.state === PENDING || runningTransition ) {
      const updates = Updates;
      Updates = null;
      runUpdates(() => lookUpstream(node, ancestors[0]), false);
      Updates = updates;
    }
  }
}
function runUpdates(fn, init) {
  if (Updates) return fn();
  let wait = false;
  if (!init) Updates = [];
  if (Effects) wait = true;else Effects = [];
  ExecCount++;
  try {
    const res = fn();
    completeUpdates(wait);
    return res;
  } catch (err) {
    if (!Updates) Effects = null;
    handleError(err);
  }
}
function completeUpdates(wait) {
  if (Updates) {
    runQueue(Updates);
    Updates = null;
  }
  if (wait) return;
  const e = Effects;
  Effects = null;
  if (e.length) runUpdates(() => runEffects(e), false);
}
function runQueue(queue) {
  for (let i = 0; i < queue.length; i++) runTop(queue[i]);
}
function runUserEffects(queue) {
  let i,
      userLength = 0;
  for (i = 0; i < queue.length; i++) {
    const e = queue[i];
    if (!e.user) runTop(e);else queue[userLength++] = e;
  }
  if (sharedConfig.context) setHydrateContext();
  for (i = 0; i < userLength; i++) runTop(queue[i]);
}
function lookUpstream(node, ignore) {
  const runningTransition = Transition ;
  node.state = 0;
  for (let i = 0; i < node.sources.length; i += 1) {
    const source = node.sources[i];
    if (source.sources) {
      if (source.state === STALE || runningTransition ) {
        if (source !== ignore) runTop(source);
      } else if (source.state === PENDING || runningTransition ) lookUpstream(source, ignore);
    }
  }
}
function markDownstream(node) {
  const runningTransition = Transition ;
  for (let i = 0; i < node.observers.length; i += 1) {
    const o = node.observers[i];
    if (!o.state || runningTransition ) {
      o.state = PENDING;
      if (o.pure) Updates.push(o);else Effects.push(o);
      o.observers && markDownstream(o);
    }
  }
}
function cleanNode(node) {
  let i;
  if (node.sources) {
    while (node.sources.length) {
      const source = node.sources.pop(),
            index = node.sourceSlots.pop(),
            obs = source.observers;
      if (obs && obs.length) {
        const n = obs.pop(),
              s = source.observerSlots.pop();
        if (index < obs.length) {
          n.sourceSlots[s] = index;
          obs[index] = n;
          source.observerSlots[index] = s;
        }
      }
    }
  }
  if (node.owned) {
    for (i = 0; i < node.owned.length; i++) cleanNode(node.owned[i]);
    node.owned = null;
  }
  if (node.cleanups) {
    for (i = 0; i < node.cleanups.length; i++) node.cleanups[i]();
    node.cleanups = null;
  }
  node.state = 0;
  node.context = null;
}
function castError(err) {
  if (err instanceof Error || typeof err === "string") return err;
  return new Error("Unknown error");
}
function handleError(err) {
  err = castError(err);
  throw err;
}
function resolveChildren(children) {
  if (typeof children === "function" && !children.length) return resolveChildren(children());
  if (Array.isArray(children)) {
    const results = [];
    for (let i = 0; i < children.length; i++) {
      const result = resolveChildren(children[i]);
      Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
    }
    return results;
  }
  return children;
}
function createComponent(Comp, props) {
  return untrack(() => Comp(props || {}));
}

function reconcileArrays(parentNode, a, b) {
  let bLength = b.length,
      aEnd = a.length,
      bEnd = bLength,
      aStart = 0,
      bStart = 0,
      after = a[aEnd - 1].nextSibling,
      map = null;
  while (aStart < aEnd || bStart < bEnd) {
    if (a[aStart] === b[bStart]) {
      aStart++;
      bStart++;
      continue;
    }
    while (a[aEnd - 1] === b[bEnd - 1]) {
      aEnd--;
      bEnd--;
    }
    if (aEnd === aStart) {
      const node = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after;
      while (bStart < bEnd) parentNode.insertBefore(b[bStart++], node);
    } else if (bEnd === bStart) {
      while (aStart < aEnd) {
        if (!map || !map.has(a[aStart])) a[aStart].remove();
        aStart++;
      }
    } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
      const node = a[--aEnd].nextSibling;
      parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
      parentNode.insertBefore(b[--bEnd], node);
      a[aEnd] = b[bEnd];
    } else {
      if (!map) {
        map = new Map();
        let i = bStart;
        while (i < bEnd) map.set(b[i], i++);
      }
      const index = map.get(a[aStart]);
      if (index != null) {
        if (bStart < index && index < bEnd) {
          let i = aStart,
              sequence = 1,
              t;
          while (++i < aEnd && i < bEnd) {
            if ((t = map.get(a[i])) == null || t !== index + sequence) break;
            sequence++;
          }
          if (sequence > index - bStart) {
            const node = a[aStart];
            while (bStart < index) parentNode.insertBefore(b[bStart++], node);
          } else parentNode.replaceChild(b[bStart++], a[aStart++]);
        } else aStart++;
      } else a[aStart++].remove();
    }
  }
}

const $$EVENTS = "_$DX_DELEGATE";
function template(html, check, isSVG) {
  const t = document.createElement("template");
  t.innerHTML = html;
  let node = t.content.firstChild;
  if (isSVG) node = node.firstChild;
  return node;
}
function delegateEvents(eventNames, document = window.document) {
  const e = document[$$EVENTS] || (document[$$EVENTS] = new Set());
  for (let i = 0, l = eventNames.length; i < l; i++) {
    const name = eventNames[i];
    if (!e.has(name)) {
      e.add(name);
      document.addEventListener(name, eventHandler);
    }
  }
}
function className(node, value) {
  if (value == null) node.removeAttribute("class");else node.className = value;
}
function style(node, value, prev = {}) {
  const nodeStyle = node.style;
  const prevString = typeof prev === "string";
  if (value == null && prevString || typeof value === "string") return nodeStyle.cssText = value;
  prevString && (nodeStyle.cssText = undefined, prev = {});
  value || (value = {});
  let v, s;
  for (s in prev) {
    value[s] == null && nodeStyle.removeProperty(s);
    delete prev[s];
  }
  for (s in value) {
    v = value[s];
    if (v !== prev[s]) {
      nodeStyle.setProperty(s, v);
      prev[s] = v;
    }
  }
  return prev;
}
function use(fn, element, arg) {
  return untrack(() => fn(element, arg));
}
function insert(parent, accessor, marker, initial) {
  if (marker !== undefined && !initial) initial = [];
  if (typeof accessor !== "function") return insertExpression(parent, accessor, initial, marker);
  createRenderEffect(current => insertExpression(parent, accessor(), current, marker), initial);
}
function eventHandler(e) {
  const key = `$$${e.type}`;
  let node = e.composedPath && e.composedPath()[0] || e.target;
  if (e.target !== node) {
    Object.defineProperty(e, "target", {
      configurable: true,
      value: node
    });
  }
  Object.defineProperty(e, "currentTarget", {
    configurable: true,
    get() {
      return node || document;
    }
  });
  if (sharedConfig.registry && !sharedConfig.done) {
    sharedConfig.done = true;
    document.querySelectorAll("[id^=pl-]").forEach(elem => elem.remove());
  }
  while (node !== null) {
    const handler = node[key];
    if (handler && !node.disabled) {
      const data = node[`${key}Data`];
      data !== undefined ? handler.call(node, data, e) : handler.call(node, e);
      if (e.cancelBubble) return;
    }
    node = node.host && node.host !== node && node.host instanceof Node ? node.host : node.parentNode;
  }
}
function insertExpression(parent, value, current, marker, unwrapArray) {
  if (sharedConfig.context && !current) current = [...parent.childNodes];
  while (typeof current === "function") current = current();
  if (value === current) return current;
  const t = typeof value,
        multi = marker !== undefined;
  parent = multi && current[0] && current[0].parentNode || parent;
  if (t === "string" || t === "number") {
    if (sharedConfig.context) return current;
    if (t === "number") value = value.toString();
    if (multi) {
      let node = current[0];
      if (node && node.nodeType === 3) {
        node.data = value;
      } else node = document.createTextNode(value);
      current = cleanChildren(parent, current, marker, node);
    } else {
      if (current !== "" && typeof current === "string") {
        current = parent.firstChild.data = value;
      } else current = parent.textContent = value;
    }
  } else if (value == null || t === "boolean") {
    if (sharedConfig.context) return current;
    current = cleanChildren(parent, current, marker);
  } else if (t === "function") {
    createRenderEffect(() => {
      let v = value();
      while (typeof v === "function") v = v();
      current = insertExpression(parent, v, current, marker);
    });
    return () => current;
  } else if (Array.isArray(value)) {
    const array = [];
    const currentArray = current && Array.isArray(current);
    if (normalizeIncomingArray(array, value, current, unwrapArray)) {
      createRenderEffect(() => current = insertExpression(parent, array, current, marker, true));
      return () => current;
    }
    if (sharedConfig.context) {
      if (!array.length) return current;
      for (let i = 0; i < array.length; i++) {
        if (array[i].parentNode) return current = array;
      }
    }
    if (array.length === 0) {
      current = cleanChildren(parent, current, marker);
      if (multi) return current;
    } else if (currentArray) {
      if (current.length === 0) {
        appendNodes(parent, array, marker);
      } else reconcileArrays(parent, current, array);
    } else {
      current && cleanChildren(parent);
      appendNodes(parent, array);
    }
    current = array;
  } else if (value instanceof Node) {
    if (sharedConfig.context && value.parentNode) return current = multi ? [value] : value;
    if (Array.isArray(current)) {
      if (multi) return current = cleanChildren(parent, current, marker, value);
      cleanChildren(parent, current, null, value);
    } else if (current == null || current === "" || !parent.firstChild) {
      parent.appendChild(value);
    } else parent.replaceChild(value, parent.firstChild);
    current = value;
  } else ;
  return current;
}
function normalizeIncomingArray(normalized, array, current, unwrap) {
  let dynamic = false;
  for (let i = 0, len = array.length; i < len; i++) {
    let item = array[i],
        prev = current && current[i];
    if (item instanceof Node) {
      normalized.push(item);
    } else if (item == null || item === true || item === false) ; else if (Array.isArray(item)) {
      dynamic = normalizeIncomingArray(normalized, item, prev) || dynamic;
    } else if ((typeof item) === "function") {
      if (unwrap) {
        while (typeof item === "function") item = item();
        dynamic = normalizeIncomingArray(normalized, Array.isArray(item) ? item : [item], Array.isArray(prev) ? prev : [prev]) || dynamic;
      } else {
        normalized.push(item);
        dynamic = true;
      }
    } else {
      const value = String(item);
      if (prev && prev.nodeType === 3 && prev.data === value) {
        normalized.push(prev);
      } else normalized.push(document.createTextNode(value));
    }
  }
  return dynamic;
}
function appendNodes(parent, array, marker) {
  for (let i = 0, len = array.length; i < len; i++) parent.insertBefore(array[i], marker);
}
function cleanChildren(parent, current, marker, replacement) {
  if (marker === undefined) return parent.textContent = "";
  const node = replacement || document.createTextNode("");
  if (current.length) {
    let inserted = false;
    for (let i = current.length - 1; i >= 0; i--) {
      const el = current[i];
      if (node !== el) {
        const isParent = el.parentNode === parent;
        if (!inserted && !i) isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);else isParent && el.remove();
      } else inserted = true;
    }
  } else parent.insertBefore(node, marker);
  return [node];
}

const _tmpl$$1 = /*#__PURE__*/template(`<div class="split-root" style="height:100%; display:flex"></div>`),
      _tmpl$2 = /*#__PURE__*/template(`<div></div>`),
      _tmpl$3 = /*#__PURE__*/template(`<div class="layout-cell"><div class="top"><div class="frame left"></div><div class="frame center"></div><div class="frame right"></div></div><div class="middle"><div class="frame left"></div><div class="center"></div><div class="frame right"></div></div><div class="bottom"><div class="frame left"></div><div class="frame center"></div><div class="frame right"></div></div></div>`),
      _tmpl$4 = /*#__PURE__*/template(`<style></style>`);
function SplitRoot(props) {
  // note: to use the full browser window, you also need this style:
  // html, body, #root { height: 100%; margin: 0; }
  // TODO pass data-split-resize-debounce to children
  let ref;
  onMount(() => {
    // setTimeout workaround for error in production build:
    // TypeError: Cannot read properties of undefined (reading 'parentNode')
    setTimeout(() => {
      const cs = window.getComputedStyle(ref.parentNode, null);
      const display = cs.getPropertyValue("display"); //console.log(`SplitRoot parent style display`, display)
      // default is (display == 'block')

      if (display == 'flex') {
        ref.style['flex-grow'] = '1';
        ref.style['height'] = '';
      }

      console.log(`SplitRoot onMount: ref`, ref);
      console.log(`SplitRoot onMount: calling initSizeChildren`);
      initSizeChildren(ref.children);
    });
  });
  return (() => {
    const _el$ = _tmpl$$1.cloneNode(true);

    const _ref$ = ref;
    typeof _ref$ === "function" ? use(_ref$, _el$) : ref = _el$;

    insert(_el$, () => props.children);

    return _el$;
  })();
} // TODO refactor SplitY + SplitX
// only difference is the class name
// SplitY: class = split-vertical
// SplitX: class = split-horizontal
// vertical splitter = flex-direction: column

function SplitY(props) {
  let ref;
  onMount(() => {
    console.log(`SplitY onMount: ref`, ref);
    console.log(`SplitY onMount: calling initSizeChildren`);
    initSizeChildren(ref.children);
  }); // https://www.solidjs.com/tutorial/props_children

  const getChildren = children(() => {
    //console.log('SplitY: props.children', props.children);
    const getChildArray = Array.isArray(props.children) ? props.children : [props.children];
    const children = getChildArray.map(getChild => {
      // fix: Uncaught TypeError: getChild is not a function
      //const childComponent = getChild();
      //console.log('getChild', typeof(getChild), getChild);
      const childComponent = getChild instanceof Function ? getChild() : getChild; //console.log('SplitY: childComponent', childComponent);
      //console.log('SplitY childComponent', typeof(childComponent), childComponent);

      if (childComponent instanceof Element && ( // guard against non-Elements, or else runtime errors
      childComponent.classList.contains('layout-cell') || childComponent.classList.contains('split-vertical') || childComponent.classList.contains('split-horizontal'))) {
        return childComponent;
      }

      return createComponent(SplitItem, {
        children: childComponent
      });
    }); //initSizeChildren(children);

    return children;
  });
  return (() => {
    const _el$2 = _tmpl$2.cloneNode(true);

    const _ref$2 = ref;
    typeof _ref$2 === "function" ? use(_ref$2, _el$2) : ref = _el$2;

    insert(_el$2, getChildren);

    createRenderEffect(_p$ => {
      const _v$ = ['split-vertical', props.reverse ? 'layout-reverse' : ''].join(' '),
            _v$2 = {
        'flex': '1 0 ' + (props.size || 'auto'),
        overflow: 'auto',
        ...(props.style || {})
      };

      _v$ !== _p$._v$ && className(_el$2, _p$._v$ = _v$);
      _p$._v$2 = style(_el$2, _v$2, _p$._v$2);
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined
    });

    return _el$2;
  })();
} // calculate initial sizes
// flex does this wrong
// example: 2 children:
//   <div size="50%">1</div>
//   <div>2</div>
// -> 1 is larger, but both should have 50%
// TODO cleanup

function initSizeChildren(children) {
  children = Array.from(children);
  const childSizeList = children.map(child => child.style.flexBasis || 'auto');
  const declaredSizeList = childSizeList.filter(size => size != 'auto');

  const parsePercent = str => str.endsWith('%') ? parseFloat(str.slice(0, -1)) / 100 : parseFloat(str);

  const add = (acc, val) => acc + val;

  const declaredSizeSum = declaredSizeList.map(parsePercent).reduce(add, 0) || 0;
  const restSizeSum = 1 - declaredSizeSum;
  const numAutoSize = childSizeList.length - declaredSizeList.length;
  const eachAutoSize = `${restSizeSum / numAutoSize * 100}%`;
  children.forEach(child => {
    if (child.style.flexBasis == 'auto') {
      child.style.flexBasis = eachAutoSize;
    }
  }); //console.log(`initSizeChildren`, { children, childSizeList, declaredSizeSum, restSizeSum, numAutoSize, eachAutoSize })

  console.log(`initSizeChildren: children=${children} childSizeList=${childSizeList} declaredSizeSum=${declaredSizeSum} restSizeSum=${restSizeSum} numAutoSize=${numAutoSize} eachAutoSize=${eachAutoSize}`);
} // horizontal splitter = flex-direction: row


function SplitX(props) {
  let ref;
  onMount(() => {
    console.log(`SplitX onMount: ref`, ref);
    console.log(`SplitX onMount: calling initSizeChildren`);
    initSizeChildren(ref.children);
  }); // https://www.solidjs.com/tutorial/props_children

  const getChildren = children(() => {
    //console.log('SplitY: props.children', props.children);
    const getChildArray = Array.isArray(props.children) ? props.children : [props.children];
    const children = getChildArray.map(getChild => {
      // fix: Uncaught TypeError: getChild is not a function
      //const childComponent = getChild();
      //console.log('getChild', typeof(getChild), getChild);
      const childComponent = getChild instanceof Function ? getChild() : getChild; //console.log('SplitY: childComponent', childComponent);
      //console.log('SplitY childComponent', typeof(childComponent), childComponent);

      if (childComponent instanceof Element && ( // guard against non-Elements, or else runtime errors
      childComponent.classList.contains('layout-cell') || childComponent.classList.contains('split-vertical') || childComponent.classList.contains('split-horizontal'))) {
        return childComponent;
      }

      return createComponent(SplitItem, {
        children: childComponent
      });
    }); //console.log(`SplitX getChildren: calling initSizeChildren`)
    //initSizeChildren(children);

    return children;
  });
  return (() => {
    const _el$3 = _tmpl$2.cloneNode(true);

    const _ref$3 = ref;
    typeof _ref$3 === "function" ? use(_ref$3, _el$3) : ref = _el$3;

    insert(_el$3, getChildren);

    createRenderEffect(_p$ => {
      const _v$3 = ['split-horizontal', props.reverse ? 'layout-reverse' : ''].join(' '),
            _v$4 = {
        'flex': '1 0 ' + (props.size || 'auto'),
        overflow: 'auto',
        ...(props.style || {})
      };

      _v$3 !== _p$._v$3 && className(_el$3, _p$._v$3 = _v$3);
      _p$._v$4 = style(_el$3, _v$4, _p$._v$4);
      return _p$;
    }, {
      _v$3: undefined,
      _v$4: undefined
    });

    return _el$3;
  })();
} // item = a leaf node in the layout tree

function SplitItem(props) {
  onMount(() => {
    // TODO disallow multiple pointers (f.e. multiple fingers)
    document.body.addEventListener('pointerup', handleMoveEnd);
    document.body.addEventListener('pointerleave', handleMoveEnd);
  });
  onCleanup(() => {
    document.body.removeEventListener('pointerup', handleMoveEnd);
    document.body.removeEventListener('pointerleave', handleMoveEnd);
    document.removeEventListener('pointermove', activeMoveListener);
  });
  let activeMoveListener = null; //let activeResizeElement = null;

  let activeMoveParent = null;

  let moveStartX = 0;
  let moveStartY = 0;
  let activeMoveOrigin = null; // TODO rename to activeMoveHandle

  let parentIsLayoutVertical = null;
  let activeMoveCell = null;
  let activeMoveCell_real = null; // TODO rename

  let activeMoveSizeKey = ''; // TODO expose option

  function handleMoveStart(event) {
    const tar = event.target;
    moveStartX = event.clientX;
    moveStartY = event.clientY;
    activeMoveOrigin = tar;
    activeMoveCell = tar.parentNode.parentNode;
    const hcl = activeMoveOrigin.classList;
    const hpcl = activeMoveOrigin.parentNode.classList; //console.log('hcl =', hcl);

    activeMoveCell_real = activeMoveCell;
    activeMoveParent = activeMoveCell.parentNode; // what handle was moved?

    const handleRight = hcl.contains('right');
    const handleLeft = hcl.contains('left');
    hpcl.contains('top');
    hpcl.contains('bottom'); //console.log(`handleLeft=${handleLeft} handleRight=${handleRight} handleTop=${handleTop} handleBottom=${handleBottom}`)

    const activeMoveParentClass = handleLeft || handleRight ? 'split-horizontal' : 'split-vertical';
    const sizeKeyPrefix = 'offset'; // all the same?

    activeMoveSizeKey = activeMoveParentClass == 'split-vertical' ? sizeKeyPrefix + 'Height' : sizeKeyPrefix + 'Width'; // find parent container

    while (activeMoveParent && activeMoveCell_real && !activeMoveParent.classList.contains(activeMoveParentClass)) {
      activeMoveCell_real = activeMoveCell_real.parentElement;
      activeMoveParent = activeMoveParent.parentElement;
    }

    if (!activeMoveParent) {
      console.log('error. activeMoveParent not found');
      return;
    }

    if (!activeMoveCell_real) {
      console.log('error. activeMoveCell_real not found');
      return;
    } //console.log('found activeMoveParent', activeMoveParent.className);
    //console.log('found activeMoveCell_real', activeMoveCell_real.className);
    // stop selecting text
    // use hidden css class to save other components


    document.body.classList.add('--layout-is-moving');

    if (activeMoveParentClass == 'split-vertical') {
      // parent is split-vertical
      // handleTop || handleBottom
      parentIsLayoutVertical = true; //console.log('add marginTop', (handleTop ? tar.offsetHeight : 0));

      {
        // live resize
        activeMoveListener = calcLayout; // hot code!
      }
    } else {
      // parent is split-horizontal
      // handleLeft || handleRight
      parentIsLayoutVertical = false;

      {
        // hot code!
        activeMoveListener = calcLayout;
      }
    }

    document.addEventListener('pointermove', activeMoveListener);
  }

  function handleMoveEnd(event) {
    if (!activeMoveListener) return;
    document.body.classList.remove('--layout-is-moving');

    document.removeEventListener('pointermove', activeMoveListener);
    activeMoveListener = null;

    if (event.type == 'pointerleave') {
      // keep layout
      return;
    }

    calcLayout(event);
  }

  function calcLayout(event) {
    const hcl = activeMoveOrigin.classList;
    const hpcl = activeMoveOrigin.parentNode.classList;
    activeMoveParent[activeMoveSizeKey];
    const containerChildren = Array.from(activeMoveParent.children);
    const firstChild = containerChildren[0];
    const lastChild = containerChildren.slice(-1)[0]; // save old sizes
    // when one cell size is changed
    // then all other cells change too (css flex)

    let node_size_new = containerChildren.map(node => node[activeMoveSizeKey]);
    let size_sum = node_size_new.reduce((acc, val) => acc + val, 0);
    let moveCellIndex = containerChildren.indexOf(activeMoveCell_real); // what handle was moved?

    const handleRight = hcl.contains('right');
    const handleLeft = hcl.contains('left');
    const handleTop = hpcl.contains('top');
    const handleBottom = hpcl.contains('bottom'); // i assume that absolute pointer positions
    // are more reliable than relative positions.
    // also, absolute positions are needed for "late resize"
    //const moveDiff = parentIsLayoutVertical ? event.movementY : event.movementX

    const moveDiffX = event.clientX - moveStartX;
    const moveDiffY = event.clientY - moveStartY;
    const moveDiff = parentIsLayoutVertical ? moveDiffY : moveDiffX;

    {
      moveStartX = event.clientX;
      moveStartY = event.clientY;
    }

    if (activeMoveCell_real == firstChild && (handleLeft || handleTop) || activeMoveCell_real == lastChild && (handleRight || handleBottom)) {
      console.log('TODO resize from container start/end');
      size_sum += moveDiff; // TODO fix resize
    } else {
      // handle is in middle of container
      // get cells before and after handle
      let index_before = 0;
      let index_after = 0;

      if (handleLeft || handleTop) {
        index_before = moveCellIndex - 1;
        index_after = moveCellIndex;
      } else {
        index_before = moveCellIndex;
        index_after = moveCellIndex + 1;
      } // change cell size


      node_size_new[index_before] += moveDiff;
      node_size_new[index_after] -= moveDiff; // set cell size

      for (let [index, node] of containerChildren.entries()) {
        const amount = node_size_new[index] / size_sum * 100 + '%';
        node.style.flexBasis = amount; // TODO this needs to be applied initially too, depending on the
        // number of panels. Currently it is not applied initially, only
        // on drag. If there are three initial panels, they need to
        // start at 33% each, etc.

        node.style.flexBasis = amount;
      }
    }
  } // csd: CSSStyleDeclaration


  function objectOfStyleDeclaration(
  /**@type {CSSStyleDeclaration}*/
  csd) {
    /** @type {{[k in keyof CSSStyleDeclaration]: string}} */
    const res = {};

    for (const key of csd) {
      res[key] = csd[key];
    }

    return res;
  }

  const childStyle = createMemo(() => {
    const el = props.childComponent; // reactive, so put this in a memo in case it changes.

    /** @type {ReturnType<typeof objectOfStyleDeclaration> | null} */

    let childStyle = null;

    if (el instanceof HTMLElement || el instanceof SVGElement) {
      // move style from child to wrapper
      // to keep the child style, wrap the child in a <div>
      childStyle = objectOfStyleDeclaration(el.style);
      el.style = null; // FIXME el.style is read only?
    }

    return childStyle;
  }); // https://www.solidjs.com/tutorial/props_children

  const getChildren = children(() => props.children);
  return (// @ts-ignore
    (() => {
      const _el$4 = _tmpl$3.cloneNode(true),
            _el$5 = _el$4.firstChild,
            _el$6 = _el$5.firstChild,
            _el$7 = _el$6.nextSibling,
            _el$8 = _el$5.nextSibling,
            _el$9 = _el$8.firstChild,
            _el$10 = _el$9.nextSibling,
            _el$11 = _el$10.nextSibling,
            _el$12 = _el$8.nextSibling,
            _el$13 = _el$12.firstChild,
            _el$14 = _el$13.nextSibling;

      _el$7.$$pointerdown = handleMoveStart;
      _el$9.$$pointerdown = handleMoveStart;

      insert(_el$10, getChildren);

      _el$11.$$pointerdown = handleMoveStart;
      _el$14.$$pointerdown = handleMoveStart;

      createRenderEffect(_p$ => {
        const _v$5 = {
          //'flex-grow': 1,
          //'flex-shrink': 0,
          //'flex-basis': props.size || 'auto',
          'flex': '1 0 ' + (props.size || 'auto'),
          ...childStyle()
        },
              _v$6 = props.style;
        _p$._v$5 = style(_el$4, _v$5, _p$._v$5);
        _p$._v$6 = style(_el$10, _v$6, _p$._v$6);
        return _p$;
      }, {
        _v$5: undefined,
        _v$6: undefined
      });

      return _el$4;
    })()
  );
}

function globalStyle(
/** @type {string} */
css) {
  const style =
  /** @type {HTMLStyleElement} */
  (() => {
    const _el$15 = _tmpl$4.cloneNode(true);

    insert(_el$15, css);

    return _el$15;
  })();

  document.head.append(style);
} // TODO better way to define style?
// we need `node.classList.toggle('expand')`
// but we dont care about the exact class name


globalStyle(
/*css*/
`
  body {
    /* css variables */
    --handleSize: 5px; /* visible handle size */
    --handlePadding: 10px; /* clickable size */
    --handleColor: gray; /* clickable size */
    --cellFrame: 4px;
    /* --handleMargin: 0px; */
  }
  /* resize handles */
  .split-vertical-resizer {
    height: var(--handleSize) !important;
    /* width: 99%; avoid overflow */
    background-color: var(--handleColor);
    flex-basis: var(--handleSize);
    flex-shrink: 0;
    flex-grow: 0;
    cursor: row-resize;
    margin: 0;
    background-clip: content-box; /* transparent padding */
    padding-top: var(--handlePadding);
    /*margin-top: var(--handleMargin);*/
		pointer-events: none;
		/* why?
		display: none;
		*/
  }
  .split-horizontal-resizer {
    width: var(--handleSize) !important;
    /* height: 99%; avoid overflow */
    background-color: var(--handleColor);
    flex-basis: var(--handleSize);
    flex-shrink: 0;
    flex-grow: 0;
    cursor: col-resize;
    margin: 0;
    background-clip: content-box; /* transparent padding */
    padding-left: var(--handlePadding);
    /*margin-left: var(--handleMargin);*/
		pointer-events: none;
		/* why?
		display: none;
		*/
  }
  body.--layout-is-moving,
  body.--layout-is-moving * {
    /* dont select text on resize/drag */
    user-select: none !important;
  }
  /* shortcuts for flex layout */
  .split-vertical {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    align-content: stretch;
  }
  .split-vertical.layout-reverse {
    flex-direction: column-reverse;
  }
  .split-horizontal {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    align-content: stretch;
  }
  .split-horizontal.layout-reverse {
    flex-direction: row-reverse;
  }
  .layout-cell {
    display: flex;
    flex-direction: column; /* frame container */
    align-items: stretch;
    align-content: stretch;
  }
  /* frame */
  .top, .bottom {
    flex-basis: var(--cellFrame);
    flex-shrink: 0;
    cursor: row-resize;
  }
  .left, .right {
    flex-basis: var(--cellFrame);
    flex-shrink: 0;
    cursor: col-resize;
  }
  /* debug frame */
  /*
  .left { background-color: yellow }
  .top > .left { background-color: lime }
  .top { background-color: green }
  .top > .right { background-color: turquoise }
  .right { background-color: blue }
  .bottom > .right { background-color: purple }
  .bottom { background-color: red }
  .bottom > .left { background-color: orange }
  */
	/* not implemented
  .top > .left { cursor: nw-resize }
  .top > .right { cursor: ne-resize }
  .bottom > .right { cursor: se-resize }
  .bottom > .left { cursor: sw-resize }
	*/
  .center, .middle { flex-grow: 1; }
  .top, .middle, .bottom {
    display: flex;
    align-items: stretch;
    align-content: stretch;
    flex-direction: row;
  }
  .layout-cell > .middle > .center {
    width: 100%;
    height: 100%;
    /*overflow: auto; auto scroll (default) */
  }
  .layout-cell > .middle {
    overflow: auto;
    /* keep layout size 100% (why overflow?) */
  }
  /* frame border */
  .layout-cell > * > .frame {
    /* border is inside */
    box-sizing: border-box;
  }
  .layout-cell > .middle > .left {
    border-top: none;
    border-right: none;
    border-bottom: none;
  }
  .layout-cell > .middle > .right {
    border-top: none;
    border-left: none;
    border-bottom: none;
  }
  .layout-cell > .top > .center {
    border-bottom: none;
    border-left: none;
    border-right: none;
  }
  .layout-cell > .bottom > .center {
    border-top: none;
    border-left: none;
    border-right: none;
  }
  .layout-cell > .bottom > .left {
    border-top: none;
    border-right: none;
  }
  .layout-cell > .bottom > .right {
    border-top: none;
    border-left: none;
  }
  .layout-cell > .top > .left {
    border-bottom: none;
    border-right: none;
  }
  .layout-cell > .top > .right {
    border-bottom: none;
    border-left: none;
  }

`); // user style

globalStyle(
/*css*/
`
  /* layout */
  body {
    /* use full window size */
    padding: 0;
  }
  .layout-cell>.middle>.center {
    /* content cell: add scrollbars when needed */
    overflow: auto;
  }
	.split-horizontal > .layout-cell {
    border-right: solid 1px #a8a8a8;
	}
	.split-horizontal > .layout-cell:last-child {
    border-right: none;
	}
	.split-vertical > .layout-cell {
    border-bottom: solid 1px #a8a8a8;
	}
	.split-vertical > .layout-cell:last-child {
    border-bottom: none;
	}
  .layout-cell>*, .layout-cell>*>.frame {
    /* frame size
       larger frames are better acccessible (touchscreen)
       but leave less room for content */
    flex-basis: 6px !important;
  }
  /* use css classes on cells like
     <L class="overflow-hidden">....</L> */
  .layout-cell>.middle>.center.overflow-hidden {
    overflow: hidden !important;
  }
  /* use css classes on containers like
     <L row class="custom-row-container">....</L> */
  .split-horizontal.custom-row-container {
    color: orange;
  }
`);

delegateEvents(["pointerdown"]);

const _tmpl$ = /*#__PURE__*/template$1(`<style>
					.content {
						width: 100%;
						height: 100%;
						background: pink;
					}
				</style>`);
function App(props) {
  return createComponent$1(SplitRoot, {
    get children() {
      return [createComponent$1(SplitX, {
        get children() {
          return [createComponent$1(SplitItem, {
            size: "20%",
            children: "aaaaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaaaaa"
          }), createComponent$1(SplitY, {
            size: "60%",

            get children() {
              return [createComponent$1(SplitItem, {
                children: "bbbbbbbbbbbbbb bbbbbbbbbbbbbb bbbbbbbbbbbbbb bbbbbbbbbbbbbb bbbbbbbbbbbbbb bbbbbbbbbbbbbb bbbbbbbbbbbbbb bbbbbbbbbbbbbb bbbbbbbbbbbbbb"
              }), createComponent$1(SplitItem, {
                children: "bbbbbbbbbbbbbb bbbbbbbbbbbbbb bbbbbbbbbbbbbb bbbbbbbbbbbbbb bbbbbbbbbbbbbb bbbbbbbbbbbbbb bbbbbbbbbbbbbb bbbbbbbbbbbbbb bbbbbbbbbbbbbb"
              }), createComponent$1(SplitX, {
                get children() {
                  return [createComponent$1(SplitItem, {
                    children: "cccccccccccccc cccccccccccccc cccccccccccccc cccccccccccccc cccccccccccccc cccccccccccccc cccccccccccccc cccccccccccccc cccccccccccccc"
                  }), createComponent$1(SplitItem, {
                    children: "cccccccccccccc cccccccccccccc cccccccccccccc cccccccccccccc cccccccccccccc cccccccccccccc cccccccccccccc cccccccccccccc cccccccccccccc"
                  })];
                }

              })];
            }

          }), createComponent$1(SplitItem, {
            children: "dddddddddddddd dddddddddddddd dddddddddddddd dddddddddddddd dddddddddddddd dddddddddddddd dddddddddddddd dddddddddddddd dddddddddddddd"
          })];
        }

      }), _tmpl$.cloneNode(true)];
    }

  });
}

render(App, document.querySelector('#root'));
