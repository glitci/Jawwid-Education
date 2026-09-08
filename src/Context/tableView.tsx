import { ReactNode, createContext, useState } from 'react';

interface TableCardView {
  view: 'tableView' | 'cardView';
  setView: React.Dispatch<React.SetStateAction<'tableView' | 'cardView'>>;
}

export const TABLECARDVIEW = createContext<TableCardView>({
  view: 'tableView',
  setView: () => {},
});

const TableCardViewContext: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [view, setView] = useState<'tableView' | 'cardView'>('tableView');

  const contextValue: TableCardView = {
    view,
    setView: (view) => setView(view),
  };

  return (
    <TABLECARDVIEW.Provider value={contextValue}>
      {children}
    </TABLECARDVIEW.Provider>
  );
};

export default TableCardViewContext;
