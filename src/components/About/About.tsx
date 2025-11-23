

export const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-6 py-16">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <section className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            About Us
          </h1>
          <p className="text-lg text-gray-600">
            A collaborative platform for reporting, tracking, and resolving
            software defects — inspired by Jira.
          </p>
        </section>

        {/* Overview */}
        <section className="bg-white shadow-md rounded-xl p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
          <p>
            The Bug Tracking System is a collaborative web application designed
            to help teams report, track, and resolve software defects
            effectively. It simulates how professional teams use tools like Jira
            to manage software quality, prioritize issues, and improve overall
            development workflow.
          </p>
          <p>
            This project provides hands-on experience in managing issue
            lifecycles, Agile methodologies, and practicing QA/QE testing and
            automation techniques.
          </p>
        </section>


      </div>
    </div>
  );
};


