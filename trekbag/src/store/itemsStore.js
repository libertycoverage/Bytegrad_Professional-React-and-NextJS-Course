import { create } from "zustand";
import { initialItems } from "..lib/constants";

// this will gonna be the store, we are immediately returning an object () => ({})
export const useItemsStore = create((set) => ({
  items: initialItems,
  addItem: (newItemText) => {
    const newItem = {
      id: new Date().getTime(),
      name: newItemText,
      packed: false,
    };

    set((state) => ({ items: [...state.items, newItem] }));
    // we are returning a new store that stores an object
  },

  deleteItem: (id) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== id);
      return { items: newItems };
    });
  },

  toggleItem: (id) => {
    set((state) => {
      const newItems = state.items.map((item) => {
        if (item.id === id) {
          return { ...item, packed: !item.packed };
        }
        return item;
      });
      return { items: newItems };
    });
  },

  //   handleRemoveAllItems: () => {
  removeAllItems: () => {
    // setItems([]);
    // set([]);
    set(() => ({ items: [] }));
    // in Zustand we do not have useState hook (setItems), Zustand is modeled after useState,
    // we get a different setter function when you create a store: set;
    // here () => {} we wanna return the new store, the store here is an object, we shouldn't return an array here set([])
    // just like with useState what you can do here you can pass a function set(() => {}), and the function can give you
    // the previous state and it can give you the access to the previous state set((prev) => {prev.}})
    // typically in Zustand is not called previous it is called state set((state) => {}})
    // we won't use the previous state, we want to return a new state, we want to return new store which is an object,
    // in there we wanna have items : [] ; items is gonna be an empty array,
    // this is very similar to the useState setter function
    // in store we gonna have items and so called Actions e.g. handleRemoveAllItems, typically names are removeAllItems, without "handle-"
    // the logic is exact same, we have store, in there we have items, all those other functions that can update the functions are called Actions
    // be default in Zustand new object set(() => ({ items: [] })); will be merged with the previous one create((set) => ({ } which means
    // that all of the other things we gonna have in store will automatically be there, and only thing you specified here
    // set(() => ({ items: [] })); will be updated : items ; all other the things will stay the same
  },
  //   handleResetToInitial: () => {
  resetToInitial: () => {
    set(() => ({ items: initialItems }));
  },
  //   handleMarkAllAsComplete:  () => {
  markAllAsComplete: () => {
    // state is a prev state
    set((state) => {
      const newItems = state.items.map((item) => {
        return { ...item, packed: true };
      });

      return { items: newItems };
    });
  },
  markAllAsIncomplete: () => {
    set((state) => {
      const newItems = state.items.map((item) => {
        return { ...item, packed: false };
      });
      return { items: newItems };
    });
  },
}));
