import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Observable, Subject } from "rxjs";
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

  getPosts() {
    this.http.get<{ message: string; posts: Post[] }>(this.apiUrl).subscribe(data => {
      this.posts = data.posts;
      this.postUpdated.next([...this.posts]);
    });
    return [...this.posts];
  }

    getPostUpdateListener(){
        return this.postUpdated.asObservable();
    }

    // addPost(title: string, content: string){
    //     const post: Post = { title: title, content: content };
    //     this.posts.push(post);
    //     this.postUpdated.next([...this.posts]);
    // }

    addPost(id: string, title: string, content: string) {
      // const id = (this.lastId++).toString(); 
      const post: Post = { id: id, title: title, content: content };
      this.http.post<{ message: string }>(this.apiUrl, post)
          .subscribe(response => {
              console.log(response.message);
              this.posts.push(post);
              this.postUpdated.next([...this.posts]);
          }, error => {
              console.error('Error adding post:', error);
          });
  }
}