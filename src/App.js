import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import _ from 'lodash';
// import logo from './logo.svg';
import './App.css';
import {
  req,
  useApiGet,
  useApiList,
  useApiShow,
  useApiLoading,
} from './api';

// const useApiState = (transform) => {
//   const raw = useSelector(state => state.api, shallowEqual);
//   return transform(raw);
// }

let renders_A = 0;
let renders_B = 0;

const useApiState = (transform, deps) => {
  const raw = useSelector((state) => {
    const newState = {
      // _loading: _.pick(state.api._loading, deps),
      ..._.pick(state.api, deps),
    };
    return newState;
  }, shallowEqual);
  return transform(raw);
};

const apiLoading = (state, key) => `${_.get(state, `_loading.${key}`)}` === `${1}`;
const apiGet = (state, key, default_value) => _.get(state, `${key}`) || default_value;
const apiList = (state, key) => ({
  list: (_.get(state, `${key}.list`) || []).map((id) => _.get(state, `${key}.raw.${id}`)),
  meta: _.get(state, `${key}.meta`) || {},
});
const apiShow = (state, key, id) => _.get(state, `${key}.raw.${id}`) || {};

// const withApi = (transform) => (WrappedComponent) => {
//   const hocComponent = ({ ...props }) => {
//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     const raw = useSelector(state => state.api, shallowEqual);
//     return <WrappedComponent {...props} {...transform(raw, props)} />
//   };
//   return hocComponent;
// };

// const ListComponent = ({
const List = ({
  // isLoading,
  // data,
  // pager,
  // filter,
  onSelectRow,
}) => {
  // const isLoading = useApiLoading('test', 'get');
  // const [data, pager] = useApiList('test');
  // const filter = useApiGet('filter', { page: 1 });
  const {
    isLoading,
    data,
    pager,
    filter,
  } = useApiState((state) => ({
    isLoading: apiLoading(state, 'test.list'),
    data: apiList(state, 'test').list || [],
    pager: apiList(state, 'test').meta || {},
    filter: apiGet(state, 'filter', { page: 1 }),
  }), ['test', 'filter']);

  // ====START ACTIONS====
  const updateList = () => {
    req.list({
      key: 'test',
      url: () => 'https://swapi.co/api/people',
      params: (state) => {
        // console.log('<ACTION>', apiGet(state, 'filter', { page: 1 }));
        return apiGet(state, 'filter', { page: 1 })
      },
      transform: (res, state) => {
        const page = apiGet(state, 'filter', {}).page || 1;
        return {
          data: (res.results || []).map((x, i) => ({ ...x, id: (i + 1) + (page * 10) })),
          meta: {
            current: page,
            total: res.count,
            total_pages: Math.ceil(res.count / 10),
          },
        };
      },
    });
  };
  const handlePrev = () => {
    req.set('filter', { page: (filter.page || 1) - 1 });
    updateList();
  };
  const handleNext = () => {
    req.set('filter', { page: (filter.page || 1) + 1 });
    updateList();
  };
  // ====END ACTIONS====

  const handleSelect = row => (e) => {
    e.preventDefault();
    onSelectRow(row);
  }

  React.useEffect(() => {
    updateList();
  }, []);
  // console.log(data, isLoading); // eslint-disable-line
  renders_A += 1;
  console.log(`<LIST A>${renders_A}`);
  return (
    <div style={{ height: 320 }}>
      {pager.total_pages > 1 && (
        <div>
          <button disabled={isLoading} onClick={handlePrev}>Prev</button>
          <span>{pager.current}</span>
          <button disabled={isLoading} onClick={handleNext}>Next</button>
        </div>
      )}
      {data.map((item) => (
        <div key={item.name}>
          <a href="/" onClick={handleSelect(item)}>{item.name}</a>
        </div>
      ))}
    </div>
  );
};

// const List = withApi((state) => ({
//   isLoading: apiLoading(state, 'test.list'),
//   data: apiList(state, 'test').list || [],
//   pager: apiList(state, 'test').meta || {},
//   filter: apiGet(state, 'filter', { page: 1 }),
// }))(ListComponent);

// const SelectedComponent = React.memo(({
const Selected = React.memo(({
  id,
  // data,
  // isLoading,
}) => {
  const {
    data,
    isLoading,
  } = useApiState(state => ({
    data: apiShow(state, 'test', id),
    isLoading: apiLoading(state, 'test.show'),
  }), ['test']);
  // const isLoading = useApiLoading('test', 'show');
  // const data = useApiShow('test', id);
  const updateItem = React.useCallback(() => {
    req.show({
      key: 'test',
      url: () => `https://swapi.co/api/people/${id}`,
      transform: (res) => {
        return { ...res, id };
      },
    });
  }, [id]);
  // React.useEffect(() => {
  //   if (!id) return;

  // }, [id]);
  renders_A += 1;
  console.log(`<SHOW A>${renders_A}`);
  return (
    <div>
      <button disabled={isLoading} onClick={updateItem} type="button">{data.name || '- no selected -'}</button>
    </div>
  );
});

// const Selected = withApi((state, props)=> ({
//   data: apiShow(state, 'test', props.id),
//   isLoading: apiLoading(state, 'test.show'),
// }))(SelectedComponent);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const Other = React.memo(() => {
  // const { data } = useApiState(state => ({
  //   data: apiGet(state, 'other', {}),
  // }))
  const { data } = useApiState(state => ({
    data: apiGet(state, 'other', {}),
  }), ['other'])
  const isLoading = useApiLoading('other', 'get');
  // const data = useApiGet('other', {});
  const getRandom = () => {
    req.get({
      key: 'other',
      url: () => `https://swapi.co/api/people/${getRandomInt(1, 87)}`,
      headers: (headers) => ({
        ...headers,
        override: 'WOW HEADERS',
      })
    });
  };
  console.log('OTHER');
  return (
    <div>
      <div>{data.name || '-'}</div>
      <button onClick={getRandom}type="button" disabled={isLoading}>Get Random</button>
    </div>
  );
});

function App() {
  // useSelector((state) => console.log(state));
  return (
    <div className="App">
      <header className="App-header">
        <Other />
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <hr />
        <div style={{ display: 'flex' }}>
          {false && (
            <div style={{ width: 600 }}>
              TYPE A
              <Crud />
            </div>
          )}
          {false && (
            <div style={{ width: 600 }}>
              TYPE B
              <Crud2 />
            </div>
          )}
          <Tester />
        </div>
      </header>
    </div>
  )
}

const Selected2 = ({ id }) => {
  const isLoading = useApiLoading('test', 'show');
  const updateItem = () => {
    req.show({
      key: 'test',
      url: () => `https://swapi.co/api/people/${id}`,
      transform: (res) => {
        return { ...res, id };
      },
    });
  }
  const data = useApiShow('test', id);

  renders_B += 1;
  console.log(`<SHOW B>${renders_B}`);

  return (
    <div>
      <button disabled={isLoading} onClick={updateItem} type="button">{data.name || '- no selected -'}</button>
    </div>
  );
}

const List2 = ({ onSelectRow }) => {
  const isLoading = useApiLoading('test', 'list');
  const filter = useApiGet('filter', {});
  const [data, pager] = useApiList('test');

  // ====START ACTIONS====
  const updateList = () => {
    req.list({
      key: 'test',
      url: () => 'https://swapi.co/api/people',
      params: (state) => {
        // console.log('<ACTION>', apiGet(state, 'filter', { page: 1 }));
        return apiGet(state, 'filter', { page: 1 })
      },
      transform: (res, state) => {
        const page = apiGet(state, 'filter', {}).page || 1;
        return {
          data: (res.results || []).map((x, i) => ({ ...x, id: (i + 1) + (page * 10) })),
          meta: {
            current: page,
            total: res.count,
            total_pages: Math.ceil(res.count / 10),
          },
        };
      },
    });
  };
  const handlePrev = () => {
    req.set('filter', { page: (filter.page || 1) - 1 });
    updateList();
  };
  const handleNext = () => {
    req.set('filter', { page: (filter.page || 1) + 1 });
    updateList();
  };
  // ====END ACTIONS====

  const handleSelect = row => (e) => {
    e.preventDefault();
    onSelectRow(row);
  }

  React.useEffect(() => {
    updateList();
  }, []);
  renders_B += 1;
  console.log(`<LIST B>${renders_B}`);
  return (
    <div style={{ height: 320 }}>
      {pager.total_pages > 1 && (
        <div>
          <button disabled={isLoading} onClick={handlePrev}>Prev</button>
          <span>{pager.current}</span>
          <button disabled={isLoading} onClick={handleNext}>Next</button>
        </div>
      )}
      {data.map((item) => (
        <div key={item.name}>
          <a href="/" onClick={handleSelect(item)}>{item.name}</a>
        </div>
      ))}
    </div>
  );
}

const Crud = () => {
  const [selected, setSelected] = React.useState({});
  const handleSelectRow = React.useCallback((row) => {
    setSelected(row);
  }, []);
  return (
    <>
      <Selected id={selected.id} />
      <List onSelectRow={handleSelectRow} />
    </>
  )
}

const Crud2 = () => {
  const [selected, setSelected] = React.useState({});
  const handleSelectRow = React.useCallback((row) => {
    setSelected(row);
  }, []);
  return (
    <>
      <Selected2 id={selected.id} />
      <List2 onSelectRow={handleSelectRow} />
    </>
  )
}

const Tester = () => {
  const isGetLoading = useApiLoading('test-get', 'get');
  const isShowLoading = useApiLoading('showlist', 'show');
  const isListLoading = useApiLoading('showlist', 'list');
  const handleTestGet = () => {
    req.get({
      key: 'test-get',
      url: () => 'https://swapi.co/api/people',
    });
  };
  const handleTestShow = () => {
    req.show({
      key: 'showlist',
      url: () => 'https://swapi.co/api/people/1',
      transform: (res) => {
        return { ...res, id: 1 }
      }
    });
  };
  const handleTestList = () => {
    req.list({
      key: 'showlist',
      url: () => 'https://swapi.co/api/people',
      transform: (res) => {
        return {
          data: res.results.map((x, i) => ({ ...x, id: i + 1 })),
        };
      },
    });
  };
  console.log('render!');
  return (
    <div>
      <button type="button" disabled={isGetLoading} onClick={handleTestGet}>TEST GET</button>
      <button type="button" disabled={isShowLoading} onClick={handleTestShow}>TEST SHOW</button>
      <button type="button" disabled={isListLoading} onClick={handleTestList}>TEST LIST</button>
    </div>
  );
}

export default App;
