import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { Subscription } from "rxjs";
import { PostService } from "../posts.service";

@Component({
    selector: 'app-post-list',
    templateUrl: "./post-list.component.html",
    styleUrls: ['./post-list.component.css'],
})

export class PostListComponent implements OnInit, OnDestroy{ 
    posts: Post[] = [];
    private postsSub!: Subscription;

    constructor(public postService: PostService, ){}
    ngOnInit(): void {
        this.postService.getPosts();
        this.postsSub = this.postService
        .getPostUpdateListener()
        .subscribe((posts: Post[]) => {
            this.posts = posts;
        });
    }

    ngOnDestroy(): void {
        this.postsSub.unsubscribe;
    }

    onDeletePost(postId: string) {
        this.postService.deletePost(postId).subscribe({
           next: (response) => {
             console.log('Post deleted successfully:', response.message);
             this.posts = this.posts.filter(post => post._id !== postId);
           },
           error: (error) => {
             console.error('Error deleting post:', error);
           }
        });
       }
}

