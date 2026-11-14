/* Shared pure gesture rules: each tile is an identity, even with repeated letters. */
(function(root){
  const trace={
    follow(path,index,tap=false){
      const at=path.indexOf(index);
      if(at<0)return [...path,index];
      if(tap&&at===path.length-1)return path.slice(0,-1);
      return path.slice(0,at+1);
    },
    points(path,positions,cursor){
      const points=path.map(i=>positions[i]).filter(Boolean);
      if(cursor&&points.length)points.push(cursor);
      return points.map(p=>`${p.x},${p.y}`).join(' ');
    },
    hit(point,positions,radius){return positions.findIndex(p=>Math.hypot(p.x-point.x,p.y-point.y)<=radius)},
    release(moved,hit,length){return !moved?'tap':hit<0||length===0?'cancel':'submit'}
  };
  if(typeof module==='object'&&module.exports)module.exports=trace;
  else root.BloomTrace=trace;
})(typeof window!=='undefined'?window:globalThis);
