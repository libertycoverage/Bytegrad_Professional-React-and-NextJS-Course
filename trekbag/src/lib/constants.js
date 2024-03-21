export const initialItems = [
  {
    id: 1,
    name: "good mood",
    packed: true,
  },
  {
    id: 2,
    name: "passport",
    packed: "false",
  },
  {
    id: 3,
    name: "phone charger",
    packed: "false",
  },
];

// we have a problem with static variables in ItemList, we cannot change value checked with checkbox in the interface which is rendered upon the static file
// we want a list that can change, when the list changes we want to rerender the components when the UI is updated, we need to use useState hook

export const secondaryButtons = [
  "Mark as complete",
  "Mark all as incomplete",
  "Reset to initial",
  "Remove all items",
];

// you can also do at the end:
// export default secondaryButtons;
