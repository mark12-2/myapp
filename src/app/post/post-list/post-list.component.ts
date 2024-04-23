import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Post } from "../post.model";
import { Subscription } from "rxjs";
import { PostService } from "../posts.service";
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-post-list',
    templateUrl: "./post-list.component.html",
    styleUrls: ['./post-list.component.css'],
})

export class PostListComponent implements OnInit, OnDestroy{ 
  @ViewChild(MatPaginator) paginator!: MatPaginator;  
    posts: Post[] = [];
    editingPostId: string | null = null; 
    private postsSub!: Subscription;
    private postUpdateSub!: Subscription;
    pageSize = 4;
    pageIndex = 0;


    constructor(public postService: PostService, ){}
    ngOnInit(): void {
        this.postService.getPosts();
        this.postsSub = this.postService
        .getPostUpdateListener()
        .subscribe((posts: Post[]) => {
            this.posts = posts;
        });
        this.postService.getPostUpdateListener().subscribe(posts => {
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

    onEditPost(postId: string) {
        this.editingPostId = postId; 
      }
    
     onSavePost(postId: string, updatedPost: Post) {
        console.log('Saving post:', updatedPost); 
        this.postService.editPost(postId, updatedPost).subscribe(() => {
          console.log('Post saved successfully'); 
          const index = this.posts.findIndex(post => post._id === postId);
          if (index !== -1) {
            this.posts[index] = updatedPost;
          }
          this.editingPostId = null; 
        });
     }
    
     onCancelEdit() {
        this.editingPostId = null;
     }

     // paginator
     handlePageChange(event: PageEvent) {
      this.pageSize = event.pageSize;
      this.pageIndex = event.pageIndex;
   }
    
}

