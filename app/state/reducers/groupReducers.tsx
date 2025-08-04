// filepath: app/state/reducers/groupReducer.ts
import { Group } from '../../data/data';

type Action =
  | { type: 'ADD_GROUP'; payload: Group }
  | { type: 'UPDATE_GROUP'; payload: Partial<Group> & { id: string } }
  | { type: 'REMOVE_GROUP'; payload: { id: string } };

export const groupReducer = (state: Group[], action: Action): Group[] => {
  switch (action.type) {
    case 'ADD_GROUP':
      return [...state, action.payload];
    case 'UPDATE_GROUP':
      return state.map((group) =>
        group.id === action.payload.id ? { ...group, ...action.payload } : group
      );
    case 'REMOVE_GROUP':
      return state.filter((group) => group.id !== action.payload.id);
    default:
      return state;
  }
};

export default groupReducer;