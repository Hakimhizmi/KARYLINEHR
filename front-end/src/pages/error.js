import { Link } from "react-router-dom"

export default function Error() {


    return(
      <main class="h-full pb-16  overflow-y-auto pt-20 ml-12">
        <div class="container flex flex-col  items-center px-6 mx-auto h-full justify-center">
          <svg
            class="w-12 h-12 mt-8 text-purple-200"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <h1 class="text-6xl font-semibold text-gray-700 dark:text-gray-200">
            404
          </h1>
          <br />
          <p class="text-gray-700 dark:text-gray-300">
          Page non trouvée. Vérifiez l'adresse ou
            <Link
              class="text-purple-600 hover:underline dark:text-purple-300"
              to="/"
            >
              &nbsp; retourner
            </Link>
            .
          </p>
        </div>
      </main>
    )
}