import React, { Component, PureComponent } from 'react';
import 'react-virtualized/styles.css';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import { pure } from 'recompose';
import logo from './logo.svg';
import './App.css';

const Profiler = React.unstable_Profiler;

let uniqueId = 0;

function generateItems() {
  let arr = [];
  for (let i = 0; i < 1000; i++) {
    arr.push({
      id: uniqueId++,
      a: Math.random(),
      b: Math.random(),
      c: Math.random(),
    });
  }

  return arr;
}

class App extends Component {
  state = {
    someItems: generateItems(),
    withBind: false,
    withPure: false,
    withCheats: false,
    withFunctionCall: false,
  };

  componentDidUpdate() {
    if (this.renderStart) {
      document.querySelector('#perf-title').innerText =
        new Date().getTime() - this.renderStart.getTime();
      this.renderStart = null;
    }
  }

  addItem = () => {
    this.setState({
      someItems: [
        {
          id: uniqueId++,
          a: Math.random(),
          b: Math.random(),
          c: Math.random(),
        },
        ...this.state.someItems,
      ],
    });
  };

  RenderItem = props =>
    this.state.withPure ? <ItemPure {...props} /> : <Item {...props} />;

  rowRenderer = ({ index, key, style }) => {
    const item = this.state.someItems[index];
    return (
      <div className="row" key={key} style={style}>
        <this.RenderItem contents={item.a} onClick={() => this.addItem()} />
        <this.RenderItem contents={item.b} onClick={() => this.addItem()} />
        <this.RenderItem contents={item.c} onClick={() => this.addItem()} />
      </div>
    );
	};

	updateTimings = (id, currentPhase, actualTime) => {
		document.querySelector('#perf-title').innerText = JSON.stringify(actualTime, 2);
	}

  render() {
    return (
      <div className="App">
        <Profiler onRender={this.updateTimings}>
          <header className="App-header">
            <img
              src={logo}
              className="App-logo"
              alt="logo"
              onClick={() => this.setState({})}
            />
            <h1 id="perf-title" className="App-title">
              Perf Demo
            </h1>
            <button
              onClick={() =>
                this.setState(state => ({
                  withPure: !state.withPure,
                }))
              }
            >
              Toggle pure: ({JSON.stringify(this.state.withPure)})
            </button>
            <button
              onClick={() =>
                this.setState(state => ({
                  withBind: !state.withBind,
                }))
              }
            >
              Toggle bind: ({JSON.stringify(this.state.withBind)})
            </button>
            <button
              onClick={() =>
                this.setState(state => ({
                  withFunctionCall: !state.withFunctionCall,
                }))
              }
            >
              Toggle with function call: (
              {JSON.stringify(this.state.withFunctionCall)})
            </button>
            <button
              onClick={() =>
                this.setState(state => ({
                  withCheats: !state.withCheats,
                }))
              }
            >
              Enable cheats: ({JSON.stringify(this.state.withCheats)})
            </button>
            <button onClick={this.addItem}>Add item</button>
          </header>
          {this.state.withCheats ? (
            <WindowScroller scrollElement={window}>
              {({ height, onChildScroll, scrollTop, isScrolling }) => (
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <List
                      autoHeight
                      height={height}
                      isScrolling={isScrolling}
                      rowCount={this.state.someItems.length}
                      rowHeight={18}
                      rowRenderer={this.rowRenderer}
                      onScroll={onChildScroll}
                      scrollTop={scrollTop}
                      width={width}
                    />
                  )}
                </AutoSizer>
              )}
            </WindowScroller>
          ) : (
            <div className="rows">
              {this.state.someItems.map(
                item =>
                  this.state.withFunctionCall ? (
                    <div className="row" key={item.id}>
                      {Item({ contents: item.a, onClick: this.addItem })}
                      {Item({ contents: item.b, onClick: this.addItem })}
                      {Item({ contents: item.c, onClick: this.addItem })}
                    </div>
                  ) : this.state.withBind ? (
                    <div className="row" key={item.id}>
                      <this.RenderItem
                        contents={item.a}
                        onClick={() => this.addItem()}
                      />
                      <this.RenderItem
                        contents={item.b}
                        onClick={() => this.addItem()}
                      />
                      <this.RenderItem
                        contents={item.c}
                        onClick={() => this.addItem()}
                      />
                    </div>
                  ) : (
                    <div className="row" key={item.id}>
                      <this.RenderItem
                        contents={item.a}
                        onClick={this.addItem}
                      />
                      <this.RenderItem
                        contents={item.b}
                        onClick={this.addItem}
                      />
                      <this.RenderItem
                        contents={item.c}
                        onClick={this.addItem}
                      />
                    </div>
                  ),
              )}
            </div>
          )}
        </Profiler>
      </div>
    );
  }
}

const Item = props => {
  return (
    <div onClick={props.onClick} className="item">
      {JSON.stringify(props.contents)}
    </div>
  );
};

class ItemPure extends PureComponent {
  render() {
    return (
      <div onClick={this.props.onClick} className="item">
        {JSON.stringify(this.props.contents)}
      </div>
    );
  }
}

export default App;
