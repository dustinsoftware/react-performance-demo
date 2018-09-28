import React from 'react';
import { pure } from 'recompose';

export function Emoji(props) {
  return props.count === 0 ? null : (
    <span onClick={props.onClick}>
      ☕️
      <Emoji count={props.count - 1} />
    </span>
  );
}

// This could also just extend PureComponent; same idea.
export const PureEmoji = pure(function PureEmoji(props) {
  return props.count === 0 ? null : (
    <span onClick={props.onClick}>
      😇
      <PureEmoji count={props.count - 1} />
    </span>
  );
});

export function FastEmoji(props) {
  return props.count === 0 ? null : (
    <span onClick={props.onClick}>
      🚀
      {FastEmoji({ count: props.count - 1 })}
    </span>
  );
}
