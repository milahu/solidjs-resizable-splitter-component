/*
based on
https://github.com/milahu/svelte-layout-resizable/blob/master/src/Layout.svelte

TODO make it more like
https://github.com/solidjs/solid-playground/blob/master/src/components/gridResizer/gridResizer.tsx

FIXME resizer element is not visible
*/

import { onMount } from 'solid-js';
import { glob as globalStyle } from 'solid-styled-components';

// vertical splitter = flex-direction: column
export function SplitY(props) {
  return (
      <div
        class={[
          'split-vertical',
          (props.reverse ? 'layout-reverse' : ''),
        ].join(' ')}
        style={{
          //'flex-basis': isNum(props.size) ? (props.size*100)+'%' : props.size,
          width: '100%',
          height: '100%',
          overflow: 'auto',
          ...(props.style || {}),
        }}
      >
        <For each={props.children}>{childComponent => {
          if (
            childComponent.classList.contains('split-vertical') ||
            childComponent.classList.contains('split-horizontal')
          ) {
            //console.log(`branch node`, childComponent)
            return childComponent;
          }
          //console.log(`leaf node`, childComponent)
          //return <SplitItem>{childComponent}</SplitItem>; // not working 0__o
          return <SplitItem childComponent={childComponent}/>;
        }}</For>
      </div>
  );
}

// horizontal splitter = flex-direction: row
export function SplitX(props) {
  return (
      <div
        class={[
          'split-horizontal',
          (props.reverse ? 'layout-reverse' : ''),
        ].join(' ')}
        style={{
          //'flex-basis': isNum(props.size) ? (props.size*100)+'%' : props.size,
          width: '100%',
          height: '100%',
          overflow: 'auto',
          ...(props.style || {}),
        }}
      >
        <For each={props.children}>{childComponent => {
          if (
            childComponent.classList.contains('split-vertical') ||
            childComponent.classList.contains('split-horizontal')
          ) {
            //console.log(`branch node`, childComponent)
            return childComponent;
          }
          //console.log(`leaf node`, childComponent)
          //return <SplitItem>{childComponent}</SplitItem>; // not working 0__o
          return <SplitItem childComponent={childComponent}/>;
        }}</For>
      </div>
  );
}

// item = a leaf node in the layout tree
function SplitItem(props) {

  onMount(() => {
    document.body.addEventListener('mouseup', handleMoveEnd);
    document.body.addEventListener('mouseleave', handleMoveEnd);
    document.body.addEventListener('touchend', handleMoveEnd);
  })

  let activeMoveEvent = null;
  let activeMoveElement = null;
  let activeMoveListener = null;
  //let activeResizeElement = null;
  let activeMoveParent = null;
  let activeMoveParentOverflow = '';
  //let isMoving = false;
  let moveStartX = 0;
  let moveStartY = 0;
  let activeMoveOrigin = null; // TODO rename to activeMoveHandle
  let parentIsLayoutVertical = null;
  let activeMoveCell = null;
  let activeMoveCell_real = null; // TODO rename
  let activeMoveSizeKey = '';

  function handleMoveStart(event) {
    const tar = event.target;
    moveStartX = event.clientX;
    moveStartY = event.clientY;
    activeMoveOrigin = tar;
    activeMoveCell = tar.parentNode.parentNode;
    const hcl = activeMoveOrigin.classList;
    const hpcl = activeMoveOrigin.parentNode.classList;
    //console.log('hcl =', hcl);
    activeMoveCell_real = activeMoveCell;
    activeMoveParent = activeMoveCell.parentNode;
    // what handle was moved?
    const handleRight = hcl.contains('right');
    const handleLeft = hcl.contains('left');
    const handleTop = hpcl.contains('top');
    const handleBottom = hpcl.contains('bottom');
    const activeMoveParentClass = (
      handleLeft || handleRight
    ) ? 'split-horizontal' : 'split-vertical';
    const sizeKeyPrefix = 'offset'; // all the same?
    activeMoveSizeKey = (activeMoveParentClass == 'split-vertical')
      ? sizeKeyPrefix+'Height'
      : sizeKeyPrefix+'Width';
    // find parent container
    while (
      activeMoveParent &&
      activeMoveCell_real &&
      !activeMoveParent.classList.contains(activeMoveParentClass)
    ) {
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
    }
    //console.log('found activeMoveParent', activeMoveParent.className);
    //console.log('found activeMoveCell_real', activeMoveCell_real.className);
    // stop selecting text
    // use hidden css class to save other components
    document.body.classList.add('--layout-is-moving');
    activeMoveEvent = (event.type[0] == 'm')
      ? 'mousemove' : 'touchmove';

    // FIXME resizer element is not visible
    activeMoveElement = tar.cloneNode(true);
    const newStyle = activeMoveElement.style;
    newStyle.position = 'absolute';
    newStyle.zIndex = 10; // force to front layer
    document.body.appendChild(activeMoveElement);
    activeMoveParentOverflow = activeMoveParent.style.overflow;
    activeMoveParent.style.overflow = 'hidden';
    // TODO verify. is this a good idea?
    // we want to avoid scrollbars on resize
    const handle_size = 1;
    if (activeMoveParentClass == 'split-vertical') {
      // parent is split-vertical
      // handleTop || handleBottom
      parentIsLayoutVertical = true;
      //console.log('add marginTop', (handleTop ? tar.offsetHeight : 0));
      newStyle.marginTop = (
        tar.offsetTop
        - (handleTop ? tar.offsetHeight : 0)
        + handle_size/2
        - event.clientY
      ) + 'px';
      newStyle.left = activeMoveParent.offsetLeft + 'px';
      newStyle.top = event.clientY + 'px';
      // will change in move handler
      newStyle.height = tar.offsetHeight + 'px';
      newStyle.width = activeMoveParent.offsetWidth + 'px';
      activeMoveElement.className = 'split-vertical-resizer';
      activeMoveListener = function(event){
        // optimized hot code
        newStyle.top = event.clientY + 'px';
      };
    } else {
      // parent is split-horizontal
      // handleLeft || handleRight
      parentIsLayoutVertical = false;
      activeMoveElement.className = 'split-horizontal-resizer';
      //console.log('add marginLeft', (handleLeft ? tar.offsetWidth : 0));
      newStyle.marginLeft = (
        tar.offsetLeft
        - (handleLeft ? tar.offsetWidth : 0)
        + handle_size/2
        - event.clientX
      ) + 'px';
      newStyle.top = activeMoveParent.offsetTop + 'px';
      newStyle.left = event.clientX + 'px';
      // will change in move handler
      newStyle.height = activeMoveParent.offsetHeight + 'px';
      newStyle.width = tar.offsetWidth + 'px';
      activeMoveListener = function(event){
        // optimized hot code
        newStyle.left = event.clientX + 'px';
      };
    }
    document.addEventListener(activeMoveEvent, activeMoveListener);
  }
  
  function debugParent(parent, keyList) {
    return Array.from(parent.children)
    .map((element)=>{
      let res = element;
      for (let k of keyList) {
        res = res[k];
      }
      return parseInt(res, 10)
    })
    .reduce((acc, val, idx, arr) => {
      acc += ' '+val;
      if (idx == arr.length - 1) {
        acc += ' = '+arr.reduce((acc,val)=> (acc+val), 0);
      }
      return acc;
    }, '');
  }
  
  function handleMoveEnd(event) {
    if (!activeMoveListener) return;
    document.body.classList.remove('--layout-is-moving');
    const moveDiffX = event.clientX - moveStartX;
    const moveDiffY = event.clientY - moveStartY;
    const moveDiff = parentIsLayoutVertical
      ? moveDiffY : moveDiffX;
    document.body.removeChild(activeMoveElement);
    activeMoveElement = null;
    activeMoveParent.style.overflow = activeMoveParentOverflow;
    document.removeEventListener(
      activeMoveEvent, activeMoveListener);
    activeMoveListener = null;
    if (event.type == 'mouseleave') { // TODO touchleave?
      // keep layout
      return;
    }
    const hcl = activeMoveOrigin.classList;
    const hpcl = activeMoveOrigin.parentNode.classList;
    const containerSize = activeMoveParent[activeMoveSizeKey];
    const containerChildren = Array.from(activeMoveParent.children);
    const firstChild = containerChildren[0];
    const lastChild = containerChildren.slice(-1)[0];
    // save old sizes
    // when one cell size is changed
    // then all other cells change too (css flex)
    let node_size_new = containerChildren
      .map((node) => node[activeMoveSizeKey]);
    let size_sum = node_size_new
      .reduce((acc, val) => (acc + val), 0);
    let moveCellIndex = containerChildren
      .indexOf(activeMoveCell_real);
    // what handle was moved?
    const handleRight = hcl.contains('right');
    const handleLeft = hcl.contains('left');
    const handleTop = hpcl.contains('top');
    const handleBottom = hpcl.contains('bottom');
    let node_before = null;
    let node_after = null;
    if (
      (
        activeMoveCell_real == firstChild &&
        (handleLeft || handleTop)
      ) ||
      (
        activeMoveCell_real == lastChild &&
        (handleRight || handleBottom)
      )
    ) {
      console.log('TODO resize from container start/end');
      size_sum += moveDiff;
      // TODO fix resize
    } else {
      // handle is in middle of container
      // get cells before and after handle
      let index_before = 0;
      let index_after = 0;
      if (handleLeft || handleTop) {
        index_before = moveCellIndex - 1;
        index_after = moveCellIndex;
      }
      else {
        index_before = moveCellIndex;
        index_after = moveCellIndex + 1;
      }
      // change cell size
      node_size_new[index_before] += moveDiff;
      node_size_new[index_after] -= moveDiff;
      // set cell size
      for (let [index, node] of containerChildren.entries()) {
        node.style.flexBasis = Math.round(
          node_size_new[index] / size_sum * 100)+'%';
      }
    }
    return;
    console.log(
      'size old:',
      debugParent(activeMoveParent, [activeMoveSizeKey]),
      '=',
      debugParent(activeMoveParent, ['style', 'flexBasis'])
    );
  }
  
  return (
    <div class="layout-cell" style="flex-basis: 50%; flex-grow: 1;">
      <div class="top">
        <div class="frame left" onMouseDown={handleMoveStart} />
        <div class="frame center" onMouseDown={handleMoveStart} />
        <div class="frame right" onMouseDown={handleMoveStart} />
      </div>

      <div class="middle">
        <div class="frame left" onMouseDown={handleMoveStart} />
        <div class="center" style={props.style}>
          {props.childComponent}
          {/* not working 0__o
          <For each={props.children}>{childComponent => {
            console.log(`leaf child`, childComponent)
            return childComponent;
          }}</For>
          */}
        </div>
        <div class="frame right" onMouseDown={handleMoveStart} />
      </div>

      <div class="bottom">
        <div class="frame left" onMouseDown={handleMoveStart} />
        <div class="frame center" onMouseDown={handleMoveStart} />
        <div class="frame right" onMouseDown={handleMoveStart} />
      </div>
    </div>
  );
}



// TODO better way to define style?
// we need `node.classList.toggle('expand')`
// but we dont care about the exact class name
globalStyle(`
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
  .top > .left { cursor: nw-resize }
  .top > .right { cursor: ne-resize }
  .bottom > .right { cursor: se-resize }
  .bottom > .left { cursor: sw-resize }
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

`);



// user style
globalStyle(`
  /* layout */
  body {
    /* use full window size */
    padding: 0;
  }
  .layout-cell>.middle>.center {
    /* content cell: add scrollbars when needed */
    overflow: auto;
  }
  .layout-cell>*>.frame {
    /* frame color and border */
    /*background-color: #f4f4f4;*/
    border: solid 1px #a8a8a8;
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

