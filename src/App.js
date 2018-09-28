import React, { Component, PureComponent } from 'react';
import 'react-virtualized/styles.css';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import logo from './logo.svg';
import './App.css';
import { PureEmoji, FastEmoji, Emoji } from './demos/emoji';
import { generateItem, generateItems } from './utils';

const Profiler = React.unstable_Profiler;

class App extends Component {
	state = {
		someItems: generateItems(),
		renderMode: '',
		withBind: false,
		withPure: false,
		withCheats: false,
		withFunctionCall: false
	};

	addItem = () => {
		this.setState({
			someItems: [generateItem(), ...this.state.someItems]
		});
	};

	rowRenderer = ({ index, key, style }) => {
		const item = this.state.someItems[index];
		return (
			<div className="row" key={key} style={style}>
				<Item
					renderMode={this.state.renderMode}
					contents={item.a}
					onClick={() => this.addItem()}
				/>
				<Item
					renderMode={this.state.renderMode}
					contents={item.b}
					onClick={() => this.addItem()}
				/>
				<Item
					renderMode={this.state.renderMode}
					contents={item.c}
					onClick={() => this.addItem()}
				/>
			</div>
		);
	};

	updateTimings = (id, currentPhase, actualTime) => {
		document.querySelector('#perf-title').innerText = JSON.stringify(
			Math.round(actualTime),
			2
		);
	};

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
					</header>
					<div>
						<button
							onClick={() =>
								this.setState(state => ({
									renderMode: ''
								}))
							}
						>
							Toggle normal: ({JSON.stringify(this.state.renderMode === '')})
						</button>
						<button
							onClick={() =>
								this.setState(state => ({
									renderMode: 'fast'
								}))
							}
						>
							Toggle with function call: (
							{JSON.stringify(this.state.renderMode === 'fast')})
						</button>
						<button
							onClick={() =>
								this.setState(state => ({
									renderMode: 'pure'
								}))
							}
						>
							Toggle pure: ({JSON.stringify(this.state.renderMode === 'pure')})
						</button>
						<button
							onClick={() =>
								this.setState(state => ({
									withBind: !state.withBind
								}))
							}
						>
							Toggle bind: ({JSON.stringify(this.state.withBind)})
						</button>
						<button
							onClick={() =>
								this.setState(state => ({
									withCheats: !state.withCheats
								}))
							}
						>
							Enable cheats: ({JSON.stringify(this.state.withCheats)})
						</button>
						<button onClick={this.addItem}>Add item</button>
					</div>
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
									this.state.withBind ? (
										<div className="row" key={item.id}>
											<Item
												contents={item.a}
												onClick={() => this.addItem()}
												renderMode={this.state.renderMode}
											/>
											<Item
												contents={item.b}
												onClick={() => this.addItem()}
												renderMode={this.state.renderMode}
											/>
											<Item
												contents={item.c}
												onClick={() => this.addItem()}
												renderMode={this.state.renderMode}
											/>
										</div>
									) : (
										<div className="row" key={item.id}>
											<Item
												contents={item.a}
												onClick={this.addItem}
												renderMode={this.state.renderMode}
											/>
											<Item
												contents={item.b}
												onClick={this.addItem}
												renderMode={this.state.renderMode}
											/>
											<Item
												contents={item.c}
												onClick={this.addItem}
												renderMode={this.state.renderMode}
											/>
										</div>
									)
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
		<div className="item">
			{JSON.stringify(props.contents)}
			{props.renderMode === 'pure' ? (
				<PureEmoji onClick={props.onClick} count={10} />
			) : props.renderMode === 'fast' ? (
				<FastEmoji onClick={props.onClick} count={10} />
			) : (
				<Emoji onClick={props.onClick} count={10} />
			)}
		</div>
	);
};

export default App;
