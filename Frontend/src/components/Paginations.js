import React from "react";
import {
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
} from "mdb-react-ui-kit";

export default function Paginations({
  currentPage,
  setCurrentPage,
  totalItems,
  postsPerPage,
}) {
  const totalPages = Math.ceil(totalItems / postsPerPage);

  return (
    <>
      <br />
      {totalPages > 1 && (
        <div className="pagination-container">
          <MDBPagination className="mb-0">
            <MDBPaginationItem disabled={currentPage === 1}>
              <MDBPaginationLink
                onClick={() => setCurrentPage((prev) => prev - 1)}
                tabIndex={-1}
                aria-disabled="true"
              >
                Previous
              </MDBPaginationLink>
            </MDBPaginationItem>
            {totalPages > 1 && (
              <MDBPagination>
                {[...Array(totalPages)].map((_, index) => (
                  <MDBPaginationItem
                    key={index}
                    active={currentPage === index + 1}
                  >
                    <MDBPaginationLink
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </MDBPaginationLink>
                  </MDBPaginationItem>
                ))}
              </MDBPagination>
            )}

            <MDBPaginationItem disabled={currentPage === totalPages}>
              <MDBPaginationLink
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </MDBPaginationLink>
            </MDBPaginationItem>
          </MDBPagination>
        </div>
      )}
    </>
  );
}
