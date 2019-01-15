export const toggle = (
  source: ReadonlyArray<any>, items: ReadonlyArray<any>, state: Readonly<any>,
) => {
  const itemsSet = new Set(items);

  let sourceState: any = state;
  if (sourceState === undefined) {
    const availableSelection = source.filter(item => itemsSet.has(item));
    sourceState = availableSelection.length !== itemsSet.size;
  }

  if (sourceState) {
    const sourceSet = new Set(source);
    return [
      ...source,
      ...items.filter(item => !sourceSet.has(item)),
    ];
  }

  return source.filter(item => !itemsSet.has(item));
};
