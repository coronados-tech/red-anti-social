import { Alert, Spinner } from 'react-bootstrap';
import PostCard from '../components/PostCard';
import CreatePostPrompt from '../components/CreatePostPrompt';
import PageContainer from '../components/PageContainer';
import PostFilterPanel from '../components/PostFilterPanel';
import { useAuth } from '../context/AuthContext';
import { useInfinitePosts } from '../hooks/useInfinitePosts';
import { usePostFilters } from '../hooks/usePostFilters';
import { getEmptyFilterMessage } from '../utils/emptyFilterMessage';

export default function Home() {
  const { user } = useAuth();

  const {
    posts,
    loading,
    loadingMore,
    error,
    hasMore,
    sentinelRef,
  } = useInfinitePosts(user?.id);

  const {
    tagFilter,
    setTagFilter,
    textFilter,
    setTextFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    selectedUser,
    setSelectedUser,
    allTags,
    filteredPosts,
    hasActiveFilters,
    clearFilters,
  } = usePostFilters(posts, { syncTagWithUrl: true });

  const hasPosts = !loading && !error && posts.length > 0;
  const emptyFilteredResults = hasActiveFilters && filteredPosts.length === 0;

  return (
    <PageContainer>
      <div className="home-feed-container">
        <aside className="home-feed-sidebar">
          {hasPosts && (
            <PostFilterPanel
              idPrefix="home"
              title="Buscador de publicaciones"
              layout="sidebar"
              allTags={allTags}
              tagFilter={tagFilter}
              onTagFilterChange={setTagFilter}
              textFilter={textFilter}
              onTextFilterChange={setTextFilter}
              dateFrom={dateFrom}
              onDateFromChange={setDateFrom}
              dateTo={dateTo}
              onDateToChange={setDateTo}
              onClear={clearFilters}
              canClear={hasActiveFilters}
              showUserFilter
              selectedUser={selectedUser}
              onSelectUser={setSelectedUser}
              onClearUser={() => setSelectedUser(null)}
            />
          )}
        </aside>

        <div className="home-feed-main">
          <div className="home-feed-list">
            <CreatePostPrompt />

            {loading && (
              <div className="home-feed-load-more home-feed-load-more--initial">
                <Spinner animation="border" role="status" />
                <span>Cargando publicaciones...</span>
              </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && posts.length === 0 && (
              <Alert variant="info">No hay publicaciones para mostrar.</Alert>
            )}

            {!loading && !error && posts.length > 0 && filteredPosts.length === 0 && (
              <Alert variant="light" className="alert-accent">
                {getEmptyFilterMessage({ selectedUser, textFilter, tagFilter })}
                {hasMore && hasActiveFilters && (
                  <span className="d-block mt-2 text-muted small">
                    Seguí scrolleando para buscar en más publicaciones.
                  </span>
                )}
              </Alert>
            )}

            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} activeTagFilter={tagFilter} layout="feed" />
            ))}

            {!loading && !error && hasMore && (
              <div
                ref={sentinelRef}
                className={
                  emptyFilteredResults
                    ? 'home-feed-load-more home-feed-load-more--sentinel-only'
                    : 'home-feed-load-more'
                }
                aria-hidden={emptyFilteredResults}
              >
                {!emptyFilteredResults &&
                  (loadingMore ? (
                    <>
                      <Spinner animation="border" role="status" />
                      <span>Cargando más publicaciones...</span>
                    </>
                  ) : (
                    <span className="home-feed-load-more-hint">Deslizá para ver más</span>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
