import {useEffect, useState} from 'react';
import {request} from 'constants/alias';
import {API, CRUD} from 'constants/config';
import {useSnackbar} from 'notistack/build';


function useFetcherList(resource, initialValues = {
  content: [],
  page: {
    size: 5,
    totalPages: 0,
    number: 0,
    totalElements: 0,
  },
  sort: {
    field: '',
    direction: '',
  },
  filter: {},
  isFilteringApplied: false
}) {

  const {enqueueSnackbar} = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState(initialValues);

  useEffect(() => {
    setLoading(true);
    fetchList();
  }, []);

  /**
   * Fetch table list data
   *
   * @param {number} goto - overridable parameter for page.number. If parameter is undefined, it uses the state's number.
   * @param {boolean} resetFilters - set true if you want to reset filters to default.
   */
  function fetchList(goto, resetFilters) {
    const {page: {number, size}, sort: {field, direction}, filter, isFilteringApplied} = list;

    let newFilter = filter === undefined ? {} : filter,
      newIsFilteringApplied = isFilteringApplied;
    if (resetFilters) {
      newFilter = initialValues.filter;
      newIsFilteringApplied = false;
    }

    request
      .post(`${API}${resource}/list?page=${goto >= 0 ? goto : number}&size=${size}&sort=${field},${direction}`, newFilter)
      .then(({data: {returnobject: entity}}) => {

        setList({
          ...list,
          content: entity.content,
          page: {
            size: entity.size,
            totalPages: entity.totalPages,
            number: entity.number,
            totalElements: entity.totalElements,
          },
          filter: newFilter,
          isFilteringApplied: newIsFilteringApplied,
        });

        setTimeout(() => {
          setLoading(false);
        }, CRUD.delay);

      })
      .catch(error => {
        console.log(error);
        setList(initialValues);
        setLoading(false);
      });
  }

  function handleNavigate(number) {
    if (number === null) return;

    const {page: {size}, sort: {field, direction}, filter} = list;

    request
      .post(`${API}${resource}/list?page=${number}&size=${size}&sort=${field},${direction}`, filter === undefined ? {} : filter)
      .then(({data: {returnobject: entity}}) => {
        setList({
          ...list,
          content: entity.content,
          page: {
            size: entity.size,
            totalPages: entity.totalPages,
            number: entity.number,
            totalElements: entity.totalElements,
          },
          sort: {
            field: field,
            direction: direction,
          },
          filter: filter,
        })
      })
      .catch(error => {
        console.log(error);
        setList(initialValues);
      });

  }

  function handleChangeRows(event) {
    const size = event.target.value;

    const {sort: {field, direction}, filter} = list;

    request
      .post(`${API}${resource}/list?page=0&size=${size}&sort=${field},${direction}`, filter === undefined ? {} : filter)
      .then(({data: {returnobject: entity}}) => {
        setList({
          ...list,
          content: entity.content,
          page: {
            size: entity.size,
            totalPages: entity.totalPages,
            number: entity.number,
            totalElements: entity.totalElements,
          },
          sort: {
            field: field,
            direction: direction,
          },
          filter: filter,
        })
      })
      .catch(error => {
        console.log(error);
        setList(initialValues);
      });

  }

  function handleSort(e) {
    const {page: {number, size}, sort, filter} = list;

    const target = e.currentTarget,
      field = target.id.split('-')[1], //use the convention "sort-xxx" where xxx is the field name that you want to sort
      isSameField = field === sort.field;

    // --->
    const newSort = {
      field: field,
      direction: (sort.direction === 'asc' && isSameField ? 'desc' : 'asc')
    };

    request
      .post(`${API}${resource}/list?page=${number}&size=${size}&sort=${newSort.field},${newSort.direction}`, filter === undefined ? {} : filter)
      .then(({data: {returnobject: entity}}) => {

        setList({
          ...list,
          content: entity.content,
          sort: newSort,
        });

      })
      .catch(error => {
        console.log(error);
        setList(initialValues);
      });

  }

  function handleDelete(id) {
    request
      .delete(`${API}${resource}/${id}`)
      .then(() => {
        enqueueSnackbar('Item has been deleted successfully', {variant: 'success'});
        fetchList(0);
      })
      .catch(error => {
        console.log(error);

        const {data: {message}} = error.response;
        enqueueSnackbar(message, {variant: 'error'});
      });
  }

  function handleFilter(payload, setSubmitting) {
    let filter = payload,
      isFilteringApplied = false;

    for (let key in filter) {

      if (filter[key] !== '') {
        let nestedKey = Object.keys(filter[key])[0];

        if (nestedKey) {
          if (filter[key][nestedKey] !== '') {
            isFilteringApplied = true;
            break;
          }
        } else {
          isFilteringApplied = true;
          break;
        }
      }
    }


    const {page: {size}, sort} = list;

    setLoading(true);

    request
      .post(`${API}${resource}/list?page=0&size=${size}&sort=${sort.field},${sort.direction}`, filter === undefined ? {} : filter)
      .then(({data: {returnobject: entity}}) => {

        setList({
          ...list,
          content: entity.content,
          page: {
            size: entity.size,
            totalPages: entity.totalPages,
            number: entity.number,
            totalElements: entity.totalElements,
          },
          filter: filter,
          isFilteringApplied: isFilteringApplied
        });

        setLoading(false);
        if (typeof setSubmitting === 'function') setSubmitting(false);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
        setList(initialValues);
        if (typeof setSubmitting === 'function') setSubmitting(false);
      });

  }

  function handleFilterReset() {
    if (!list.isFilteringApplied) return;
    fetchList(0, true);
  }

  return {
    loading,
    list,
    fetchList,
    handleNavigate,
    handleChangeRows,
    handleSort,
    handleDelete,
    handleFilter,
    handleFilterReset,
  }

}

export default useFetcherList;
