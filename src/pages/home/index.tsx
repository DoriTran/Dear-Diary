// import type { FC, Dispatch, SetStateAction } from 'react';

import { NotchedCard } from '@/packages/ui';

// import { useRef, useState } from 'react';

// import './index.styles.css';

// import AdDragDrop from '@/packages/base/AdDragDrop/AdDragDrop';
// import useScrollOffset from '@/packages/base/AdDragDrop/useScrollOffset';

// interface Item {
//   id: string;
//   value: number;
// }

// interface Group {
//   id: 'first' | 'second' | 'third';
//   value: string;
// }

// const ItemCard: FC<{ group: string; item: Item }> = ({ group, item }) => {
//   return (
//     <AdDragDrop
//       sortInGroup="group"
//       data={{ id: item.id, value: item.value, group }}
//       from={`item ${item.id}`}
//     >
//       <div className="item" style={{ height: item.value }}>
//         <div className="drag-handle" data-handle>
//           ⠿
//         </div>
//         {item.id}
//       </div>
//     </AdDragDrop>
//   );
// };

// const List: FC<{
//   title: string;
//   items: Item[];
//   setItems: Dispatch<SetStateAction<Item[]>>;
// }> = ({ title, items, setItems }) => {
//   return (
//     <AdDragDrop
//       autoScroll
//       sortInGroup="container"
//       sortableGroup="group"
//       data={{ id: title, value: title }}
//       setSortableData={setItems}
//       from={`group ${title}`}
//     >
//       <div className="list" style={{ maxHeight: '700px', overflow: 'auto' }}>
//         <h3 className="list-title">{title}</h3>
//         {items.map((item) => (
//           <ItemCard key={item.id} group={title} item={item} />
//         ))}
//       </div>
//     </AdDragDrop>
//   );
// };

// const Home: FC = () => {
//   const [first, setFirst] = useState<Item[]>([
//     { id: 'C', value: 300 },
//     { id: 'A', value: 100 },
//     { id: 'B', value: 200 },
//   ]);

//   const [second, setSecond] = useState<Item[]>([{ id: 'D', value: 100 }]);

//   const [third, setThird] = useState<Item[]>([]);

//   const maped: Record<
//     Group['id'],
//     { items: Item[]; setItems: Dispatch<SetStateAction<Item[]>> }
//   > = {
//     first: { items: first, setItems: setFirst },
//     second: { items: second, setItems: setSecond },
//     third: { items: third, setItems: setThird },
//   };

//   const [groups, setGroups] = useState<Group[]>([
//     { id: 'first', value: 'first' },
//     { id: 'second', value: 'second' },
//     { id: 'third', value: 'third' },
//   ]);

//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const extraOffset = useScrollOffset(containerRef);

//   return (
//     <>
//       <AdDragDrop
//         autoScroll
//         extraScrollOffset={extraOffset}
//         sortableGroup="container"
//         setSortableData={setGroups}
//         from="container"
//       >
//         <div ref={containerRef} className="container">
//           {groups.map((group) => (
//             <List
//               key={group.id}
//               title={group.value}
//               items={maped[group.id].items}
//               setItems={maped[group.id].setItems}
//             />
//           ))}
//         </div>
//       </AdDragDrop>
//     </>
//   );
// };

// export default Home;

export default function Home() {
  return (
    <div
      style={{
        padding: 200,
        maxWidth: '100vw',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <NotchedCard notchedOnly />
      <NotchedCard selected />
      <NotchedCard>
        {'Sample label or note title — children render inside the NotchedCard.'}
      </NotchedCard>
    </div>
  );
}
