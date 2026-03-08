const prerender = true;
const ssr = false;
function entries() {
  return ["push", "pull", "legs"].map((type) => ({ type }));
}
const load = ({ params }) => {
  return { type: params.type };
};
export {
  entries,
  load,
  prerender,
  ssr
};
