import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Observable, Subject, catchError, tap, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})

export class PostService{
    private posts: Post [] = [];
    private postUpdated = new Subject <Post[]>()
    private apiUrl = 'http://localhost:3000/api/posts';
    private lastId = 0;

  constructor(private http: HttpClient) { }
  // fetch post
  getPosts() {
    this.http.get<{ message: string; posts: Post[] }>(this.apiUrl).subscribe(data => {
      this.posts = data.posts;
      this.postUpdated.next([...this.posts]);
      return this.http.get<Post[]>(this.apiUrl);
    });
    return [...this.posts];
  }

    getPostUpdateListener(){
        return this.postUpdated.asObservable();
    }


    //add post function
    addPost(title: string, content: string, imageUrl: string){
      const id = (this.lastId++).toString(); 
      const post: Post = { _id: id, title: title, content: content, imageUrl: imageUrl };
      this.http.post<{ message: string }>(this.apiUrl, post)
      .subscribe(response => {
          console.log(response.message);
          this.posts.push(post);
          this.postUpdated.next([...this.posts]);
      }, error => {
          console.error('Error adding post:', error);
      });
}

  // delete post function
  deletePost(postId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${postId}`);
   }
  
   editPost(postId: string, updatedPost: Post): Observable<any> {
    return this.http.put(`${this.apiUrl}/${postId}`, updatedPost).pipe(
        tap(() => {

        })
    );
}
   
}