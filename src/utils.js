let uniqueId = 0;

export function generateItem() {
	return (
		{
      id: uniqueId++,
      a: Math.random(),
      b: Math.random(),
      c: Math.random(),
    }
	);
}
export function generateItems() {
  let arr = [];
  for (let i = 0; i < 100; i++) {
    arr.push(generateItem());
  }

  return arr;
}
